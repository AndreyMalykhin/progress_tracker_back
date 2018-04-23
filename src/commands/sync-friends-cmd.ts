import Knex from "knex";
import { IFriendship } from "models/friendship";
import { IUser } from "models/user";
import Facebook from "services/facebook";
import UserFetcher from "services/user-fetcher";
import DbTable from "utils/db-table";
import ID from "utils/id";
import { makeLog } from "utils/log";

type ISyncFriendsCmd = (
  userId: ID,
  facebookAccessToken: string
) => Promise<void>;

const log = makeLog("sync-friends-cmd");

function makeSyncFriendsCmd(
  userFetcher: UserFetcher,
  facebook: Facebook,
  db: Knex
) {
  const syncFriendsCmd = async (userId: ID, facebookAccessToken: string) => {
    log.trace("syncFriendsCmd", "userId=%o", userId);
    const [remoteFriendIds, localFriendIds] = await Promise.all([
      getRemoteFriendIds(facebookAccessToken, facebook),
      getLocalFriendIds(userId, userFetcher)
    ]);
    const friendshipsToAdd: IFriendship[] = [];

    for (const remoteFriendId in remoteFriendIds) {
      if (!localFriendIds[remoteFriendId]) {
        const friend = await userFetcher.getByFacebookId(remoteFriendId);

        if (friend) {
          friendshipsToAdd.push({
            srcId: userId,
            targetId: friend.id
          } as IFriendship);
        }
      }
    }

    await addFriendships(friendshipsToAdd, db);
    const friendshipsToRemove: IFriendship[] = [];

    for (const localFriendId in localFriendIds) {
      if (!remoteFriendIds[localFriendId]) {
        friendshipsToRemove.push({
          srcId: userId,
          targetId: localFriendIds[localFriendId]
        } as IFriendship);
      }
    }

    await removeFriendships(friendshipsToRemove, db);
  };
  return syncFriendsCmd;
}

async function removeFriendships(friendships: IFriendship[], db: Knex) {
  log.trace("removeFriendships", "count=%o", friendships.length);

  if (!friendships.length) {
    return;
  }

  const values = friendships
    .map(friendship => `(${friendship.srcId}, ${friendship.targetId})`)
    .join(",");
  await db(DbTable.Friendships)
    .whereRaw(`(??, ??) in (${values})`, ["srcId", "targetId"])
    .delete();
}

async function addFriendships(friendships: IFriendship[], db: Knex) {
  log.trace("addFriendships", "count=%o", friendships.length);

  if (!friendships.length) {
    return;
  }

  await db(DbTable.Friendships).insert(friendships);
}

async function getRemoteFriendIds(
  facebookAccessToken: string,
  facebook: Facebook
) {
  let nextPageUrl;
  let remoteFriendsResponse;
  const remoteFriendIds: { [facebookId: string]: boolean } = {};
  let remoteFriendIdCount = 0;

  do {
    remoteFriendsResponse = await facebook.getFriends(
      facebookAccessToken,
      nextPageUrl
    );

    for (const friend of remoteFriendsResponse.data) {
      remoteFriendIds[friend.id] = true;
    }

    remoteFriendIdCount += remoteFriendsResponse.data.length;
    nextPageUrl =
      remoteFriendsResponse.paging && remoteFriendsResponse.paging.next;
  } while (nextPageUrl);

  log.trace("getRemoteFriendIds", "count=%o", remoteFriendIdCount);
  return remoteFriendIds;
}

async function getLocalFriendIds(userId: ID, userFetcher: UserFetcher) {
  const localFriendIds: { [facebookId: string]: ID } = {};
  let fetchedFriends: IUser[];
  let pageOffset = 0;
  const pageSize = 32;
  let localFriendIdCount = 0;

  do {
    fetchedFriends = await userFetcher.getFriendsUnordered(
      userId,
      pageOffset,
      pageSize
    );
    pageOffset += pageSize;
    localFriendIdCount += fetchedFriends.length;

    for (const friend of fetchedFriends) {
      localFriendIds[friend.facebookId!] = friend.id;
    }
  } while (fetchedFriends.length === pageSize);

  log.trace("getLocalFriendIds", "count=%o", localFriendIdCount);
  return localFriendIds;
}

export { makeSyncFriendsCmd, ISyncFriendsCmd };
