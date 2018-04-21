import Knex from "knex";
import { IFriendship } from "models/friendship";
import { IUser } from "models/user";
import Facebook from "services/facebook";
import UserFetcher from "services/user-fetcher";
import DbTable from "utils/db-table";
import ID from "utils/id";

type ISyncFriendsCmd = (
  userId: ID,
  facebookAccessToken: string
) => Promise<void>;

function makeSyncFriendsCmd(
  userFetcher: UserFetcher,
  facebook: Facebook,
  db: Knex
) {
  return async (userId: ID, facebookAccessToken: string) => {
    const remoteFriendIds = await getRemoteFriendIds(
      facebookAccessToken,
      facebook
    );
    const localFriendIds = await getLocalFriendIds(userId, userFetcher);

    for (const remoteFriendId in remoteFriendIds) {
      if (!localFriendIds[remoteFriendId]) {
        const friend = await userFetcher.getByFacebookId(remoteFriendId);

        if (friend) {
          await addFriend(userId, friend.id, db);
        }
      }
    }

    for (const localFriendId in localFriendIds) {
      if (!remoteFriendIds[localFriendId]) {
        await removeFriend(userId, localFriendIds[localFriendId], db);
      }
    }
  };
}

async function removeFriend(srcId: ID, targetId: ID, db: Knex) {
  await db(DbTable.Friendships)
    .where({ srcId, targetId })
    .delete();
}

async function addFriend(srcId: ID, targetId: ID, db: Knex) {
  await db(DbTable.Friendships).insert({ srcId, targetId } as IFriendship);
}

async function getRemoteFriendIds(
  facebookAccessToken: string,
  facebook: Facebook
) {
  let nextPageUrl;
  let remoteFriendsResponse;
  const remoteFriendIds: { [facebookId: string]: boolean } = {};

  do {
    remoteFriendsResponse = await facebook.getFriends(
      facebookAccessToken,
      nextPageUrl
    );

    for (const friend of remoteFriendsResponse.data) {
      remoteFriendIds[friend.id] = true;
    }

    nextPageUrl =
      remoteFriendsResponse.paging && remoteFriendsResponse.paging.next;
  } while (nextPageUrl);

  return remoteFriendIds;
}

async function getLocalFriendIds(userId: ID, userFetcher: UserFetcher) {
  const localFriendIds: { [facebookId: string]: ID } = {};
  let friends: IUser[];
  let pageOffset = 0;
  const pageSize = 32;

  do {
    friends = await userFetcher.getFriendsUnordered(
      userId,
      pageOffset,
      pageSize
    );
    pageOffset += pageSize;

    for (const friend of friends) {
      localFriendIds[friend.facebookId!] = friend.id;
    }
  } while (friends.length);

  return localFriendIds;
}

export { makeSyncFriendsCmd, ISyncFriendsCmd };
