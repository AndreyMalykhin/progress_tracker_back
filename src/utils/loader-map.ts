import DataLoader from "dataloader";
import { NotFound } from "http-errors";
import { IAsset } from "models/asset";
import { IAvatar } from "models/avatar";
import { IGymExerciseEntry } from "models/gym-exercise-entry";
import { IIcon } from "models/icon";
import { ITask } from "models/task";
import { ITrackable } from "models/trackable";
import { IUser } from "models/user";
import AssetFetcher from "services/asset-fetcher";
import AvatarFetcher from "services/avatar-fetcher";
import GymExerciseEntryFetcher from "services/gym-exercise-entry-fetcher";
import IconFetcher from "services/icon-fetcher";
import TaskFetcher from "services/task-fetcher";
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
  gymExerciseEntry: DataLoader<ID, IGymExerciseEntry>;
  task: DataLoader<ID, ITask>;
}

interface IFetcher<TId, TEntity> {
  getByIds: (ids: TId[]) => Promise<TEntity[]>;
}

function makeLoaderMapFactory(
  avatarFetcher: AvatarFetcher,
  userFetcher: UserFetcher,
  iconFetcher: IconFetcher,
  trackableFetcher: TrackableFetcher,
  assetFetcher: AssetFetcher,
  gymExerciseEntryFetcher: GymExerciseEntryFetcher,
  taskFetcher: TaskFetcher
): ILoaderMapFactory {
  return () => {
    return {
      asset: makeLoader(assetFetcher),
      avatar: makeLoader(avatarFetcher),
      gymExerciseEntry: makeLoader(gymExerciseEntryFetcher),
      icon: makeLoader(iconFetcher),
      task: makeLoader(taskFetcher),
      trackable: makeLoader(trackableFetcher),
      user: makeLoader(userFetcher)
    };
  };
}

function makeLoader<TId extends string, T extends { id: TId }>(
  fetcher: IFetcher<TId, T>
) {
  return new DataLoader<TId, T>(async ids => {
    const rows = await fetcher.getByIds(ids);
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
