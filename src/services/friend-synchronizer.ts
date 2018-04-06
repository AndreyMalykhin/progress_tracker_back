import Knex from "knex";
import FacebookService from "services/facebook-service";
import UserService from "services/user-service";
import ID from "utils/id";

class FriendSynchronizer {
  private userService: UserService;
  private facebookService: FacebookService;

  public constructor(
    userService: UserService,
    facebookService: FacebookService
  ) {
    this.userService = userService;
    this.facebookService = facebookService;
  }

  public async sync(userId: ID, facebookAccessToken: string) {
    const remoteFriendIds = await this.getRemoteFriendIds(facebookAccessToken);
    const localFriendIds = await this.getLocalFriendIds(userId);

    for (const remoteFriendId in remoteFriendIds) {
      if (!localFriendIds[remoteFriendId]) {
        const friend = await this.userService.getByFacebookId(remoteFriendId);

        if (friend) {
          await this.userService.addFriend(userId, friend.id);
        }
      }
    }

    for (const localFriendId in localFriendIds) {
      if (!remoteFriendIds[localFriendId]) {
        await this.userService.removeFriend(
          userId,
          localFriendIds[localFriendId]
        );
      }
    }
  }

  private async getRemoteFriendIds(facebookAccessToken: string) {
    let nextPageUrl;
    let remoteFriendsResponse;
    const remoteFriendIds: { [facebookId: string]: boolean } = {};

    do {
      remoteFriendsResponse = await this.facebookService.getFriends(
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

  private async getLocalFriendIds(userId: ID) {
    const localFriendIds: { [facebookId: string]: ID } = {};

    for (const friend of await this.userService.getUserFriends(userId)) {
      localFriendIds[friend.facebookId!] = friend.id;
    }

    return localFriendIds;
  }
}

export default FriendSynchronizer;
