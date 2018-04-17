import DataLoader from "dataloader";
import { NotFound } from "http-errors";
import { IAsset } from "models/asset";
import { IAvatar } from "models/avatar";
import { IIcon } from "models/icon";
import { ITrackable } from "models/trackable";
import { IUser } from "models/user";
import AssetFetcher from "services/asset-fetcher";
import AvatarFetcher from "services/avatar-fetcher";
import IconFetcher from "services/icon-fetcher";
import TrackableFetcher from "services/trackable-fetcher";
import UserFetcher from "services/user-fetcher";
import ID from "utils/id";
import isIdEqual from "utils/is-id-equal";

type ILoaderMapFactory = () => ILoaderMap;

interface ILoaderMap {
  avatar: DataLoader<ID, IAvatar>;
  user: DataLoader<ID, IUser>;
  icon: DataLoader<ID, IIcon>;
  trackable: DataLoader<ID, ITrackable>;
  asset: DataLoader<ID, IAsset>;
}

function makeLoaderMapFactory(
  avatarFetcher: AvatarFetcher,
  userFetcher: UserFetcher,
  iconFetcher: IconFetcher,
  trackableFetcher: TrackableFetcher,
  assetFetcher: AssetFetcher
): ILoaderMapFactory {
  return () => {
    return {
      asset: makeAssetLoader(assetFetcher),
      avatar: makeAvatarLoader(avatarFetcher),
      icon: makeIconLoader(iconFetcher),
      trackable: makeTrackableLoader(trackableFetcher),
      user: makeUserLoader(userFetcher)
    };
  };
}

function makeAvatarLoader(avatarFetcher: AvatarFetcher) {
  return new DataLoader<ID, IAvatar>(async ids => {
    const rows = await avatarFetcher.getByIds(ids);
    return mapRowsToIds(rows, ids);
  });
}

function makeUserLoader(userFetcher: UserFetcher) {
  return new DataLoader<ID, IUser>(async ids => {
    const rows = await userFetcher.getByIds(ids);
    return mapRowsToIds(rows, ids);
  });
}

function makeIconLoader(iconFetcher: IconFetcher) {
  return new DataLoader<ID, IIcon>(async ids => {
    const rows = await iconFetcher.getByIds(ids);
    return mapRowsToIds(rows, ids);
  });
}

function makeTrackableLoader(trackableFetcher: TrackableFetcher) {
  return new DataLoader<ID, ITrackable>(async ids => {
    const rows = await trackableFetcher.getByIds(ids);
    return mapRowsToIds(rows, ids);
  });
}

function makeAssetLoader(assetFetcher: AssetFetcher) {
  return new DataLoader<ID, IAsset>(async ids => {
    const rows = await assetFetcher.getByIds(ids);
    return mapRowsToIds(rows, ids);
  });
}

function mapRowsToIds<TId extends string, TRow extends { id: TId }>(
  rows: TRow[],
  ids: TId[]
) {
  return ids.map(id => {
    for (const row of rows) {
      if (isIdEqual(row.id, id)) {
        return row;
      }
    }

    return new NotFound("ID not found: " + id);
  });
}

export { makeLoaderMapFactory, ILoaderMapFactory, ILoaderMap };
