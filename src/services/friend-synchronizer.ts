import Knex from "knex";
import FacebookService from "services/facebook-service";
import UserService from "services/user-service";

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

  public async sync(userId: string, facebookAccessToken: string) {
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

  private async getLocalFriendIds(userId: string) {
    const localFriendIds: { [facebookId: string]: string } = {};

    for (const friend of await this.userService.getFriends(userId)) {
      localFriendIds[friend.facebookId!] = friend.id;
    }

    return localFriendIds;
  }
}

export default FriendSynchronizer;
