import DataLoader from "dataloader";
import { IAvatar } from "models/avatar";
import { IUser } from "models/user";
import AvatarService from "services/avatar-service";
import UserService from "services/user-service";

type ILoaderMapFactory = () => ILoaderMap;

interface ILoaderMap {
  avatar: DataLoader<string, IAvatar>;
  user: DataLoader<string, IUser>;
}

function makeLoaderMapFactory(
  avatarService: AvatarService,
  userService: UserService
): ILoaderMapFactory {
  return () => {
    return {
      avatar: makeAvatarLoader(avatarService),
      user: makeUserLoader(userService)
    };
  };
}

function makeAvatarLoader(avatarService: AvatarService) {
  return new DataLoader<string, IAvatar>(async ids => {
    const rows = await avatarService.getByIds(ids);
    return mapRowsToIds(rows, ids);
  });
}

function makeUserLoader(userService: UserService) {
  return new DataLoader<string, IUser>(async ids => {
    const rows = await userService.getByIds(ids);
    return mapRowsToIds(rows, ids);
  });
}

function mapRowsToIds<K, V extends { id: K }>(rows: V[], ids: K[]) {
  return ids.map(id => {
    for (const row of rows) {
      if (row.id === id) {
        return row;
      }
    }

    return new Error("ID not found: " + id);
  });
}

export { makeLoaderMapFactory, ILoaderMapFactory, ILoaderMap };
