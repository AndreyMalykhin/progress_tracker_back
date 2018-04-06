import DataLoader from "dataloader";
import { IAsset } from "models/asset";
import { IAvatar } from "models/avatar";
import { IIcon } from "models/icon";
import { ITrackable } from "models/trackable";
import { IUser } from "models/user";
import AssetService from "services/asset-service";
import AvatarService from "services/avatar-service";
import IconService from "services/icon-service";
import TrackableService from "services/trackable-service";
import UserService from "services/user-service";
import ID from "utils/id";

type ILoaderMapFactory = () => ILoaderMap;

interface ILoaderMap {
  avatar: DataLoader<ID, IAvatar>;
  user: DataLoader<ID, IUser>;
  icon: DataLoader<ID, IIcon>;
  trackable: DataLoader<ID, ITrackable>;
  asset: DataLoader<ID, IAsset>;
}

function makeLoaderMapFactory(
  avatarService: AvatarService,
  userService: UserService,
  iconService: IconService,
  trackableService: TrackableService,
  assetService: AssetService
): ILoaderMapFactory {
  return () => {
    return {
      asset: makeAssetLoader(assetService),
      avatar: makeAvatarLoader(avatarService),
      icon: makeIconLoader(iconService),
      trackable: makeTrackableLoader(trackableService),
      user: makeUserLoader(userService)
    };
  };
}

function makeAvatarLoader(avatarService: AvatarService) {
  return new DataLoader<ID, IAvatar>(async ids => {
    const rows = await avatarService.getByIds(ids);
    return mapRowsToIds(rows, ids);
  });
}

function makeUserLoader(userService: UserService) {
  return new DataLoader<ID, IUser>(async ids => {
    const rows = await userService.getByIds(ids);
    return mapRowsToIds(rows, ids);
  });
}

function makeIconLoader(iconService: IconService) {
  return new DataLoader<ID, IIcon>(async ids => {
    const rows = await iconService.getByIds(ids);
    return mapRowsToIds(rows, ids);
  });
}

function makeTrackableLoader(trackableService: TrackableService) {
  return new DataLoader<ID, ITrackable>(async ids => {
    const rows = await trackableService.getByIds(ids);
    return mapRowsToIds(rows, ids);
  });
}

function makeAssetLoader(assetService: AssetService) {
  return new DataLoader<ID, IAsset>(async ids => {
    const rows = await assetService.getByIds(ids);
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
