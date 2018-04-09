import Knex from "knex";
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
    .delete()
    .limit(1);
}

async function addFriend(srcId: ID, targetId: ID, db: Knex) {
  await db(DbTable.Friendships).insert({ srcId, targetId });
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

  for (const friend of await userFetcher.getFriends(userId)) {
    localFriendIds[friend.facebookId!] = friend.id;
  }

  return localFriendIds;
}

export { makeSyncFriendsCmd, ISyncFriendsCmd };
