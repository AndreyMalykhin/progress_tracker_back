import aggregateProgress from "commands/aggregate-progress";
import Faker from "faker";
import Knex from "knex";
import { ActivityType } from "models/activity";
import { IAggregatable } from "models/aggregatable";
import { IAggregate, IAggregateChildren } from "models/aggregate";
import { IApproval } from "models/approval";
import { IAsset } from "models/asset";
import { IAvatar } from "models/avatar";
import { ICounter } from "models/counter";
import { ICounterProgressChangedActivity } from "models/counter-progress-changed-activity";
import Difficulty from "models/difficulty";
import { IExternalGoalReviewedActivity } from "models/external-goal-reviewed-activity";
import { IFriendship } from "models/friendship";
import { IGoal } from "models/goal";
import { IGoalAchievedActivity } from "models/goal-achieved-activity";
import { IGoalApprovedActivity } from "models/goal-approved-activity";
import { IGoalRejectedActivity } from "models/goal-rejected-activity";
import { IGymExercise } from "models/gym-exercise";
import { IGymExerciseEntry } from "models/gym-exercise-entry";
import { IGymExerciseEntryAddedActivity } from "models/gym-exercise-entry-added-activity";
import { IMute } from "models/mute";
import { INumericalGoal } from "models/numerical-goal";
import { INumericalGoalProgressChangedActivity } from "models/numerical-goal-progress-changed-activity";
import ProgressDisplayMode from "models/progress-display-mode";
import RejectReason from "models/reject-reason";
import { IRejection } from "models/rejection";
import ReportReason from "models/report-reason";
import ReviewStatus from "models/review-status";
import { ITask } from "models/task";
import { ITaskGoal } from "models/task-goal";
import { ITaskGoalProgressChangedActivity } from "models/task-goal-progress-changed-activity";
import { ITrackable, TrackableType } from "models/trackable";
import { ITrackableAddedActivity } from "models/trackable-added-activity";
import { TrackableStatus } from "models/trackable-status";
import { bonusRatingForReview, IUser } from "models/user";
import { IUserReport } from "models/user-report";
import DbTable from "utils/db-table";
import ID from "utils/id";

async function seed(db: Knex) {
  const totalUserCount = 128;
  const userCountPerBatch = 16;
  const connectionPoolSize = 4;
  const batchCount = Math.ceil(
    totalUserCount / userCountPerBatch / connectionPoolSize
  );

  for (let k = 0; k < batchCount; ++k) {
    const promises = [];

    for (let i = 0; i < connectionPoolSize; ++i) {
      const promise = db.transaction(transaction =>
        batch(userCountPerBatch, transaction)
      );
      promises.push(promise);
    }

    await Promise.all(promises);
  }
}

async function batch(userCount: number, transaction: Knex.Transaction) {
  const userPromises = [];

  for (let j = 0; j < userCount; ++j) {
    userPromises.push(newUser(transaction));
  }

  const users = await Promise.all(userPromises);
  const trackablePromises = [];

  for (const user of users) {
    trackablePromises.push(newTrackables(transaction, user));
  }

  const usersTrackables = await Promise.all(trackablePromises);
  const trackables = [];

  for (const userTrackables of usersTrackables) {
    trackables.push(...userTrackables);
  }

  for (const user of users) {
    const userTrackables = [];
    const externalTrackables = [];

    for (const trackable of trackables) {
      if (trackable.userId === user.id) {
        userTrackables.push(trackable);
      } else {
        externalTrackables.push(trackable);
      }
    }

    const activitiesPromise = newActivities(
      transaction,
      user,
      userTrackables,
      externalTrackables
    );
    const reviewsPromise = newReviews(transaction, user, externalTrackables);
    const externalUsers = users.filter(
      externalUser => externalUser.id !== user.id
    );
    const friendshipsPromise = newFriendships(transaction, user, externalUsers);
    const mutesPromise = newMutes(transaction, user, externalUsers);
    const userReportsPromise = newUserReports(transaction, user, externalUsers);
    await Promise.all([
      activitiesPromise,
      reviewsPromise,
      friendshipsPromise,
      mutesPromise,
      userReportsPromise
    ]);
  }
}

async function newUserReports(db: Knex, user: IUser, externalUsers: IUser[]) {
  const reports = [];

  for (const externalUser of externalUsers) {
    reports.push({
      date: newCreationDate(),
      reasonId: nweReportReason(),
      reportedId: externalUser.id,
      reporterId: user.id
    } as IUserReport);
  }

  await db(DbTable.UserReports).insert(reports);
}

async function newMutes(db: Knex, user: IUser, externalUsers: IUser[]) {
  const mutes = [];

  for (const externalUser of externalUsers) {
    mutes.push({
      date: newCreationDate(),
      srcId: user.id,
      targetId: externalUser.id
    } as IMute);
  }

  await db(DbTable.Mutes).insert(mutes);
}

async function newFriendships(db: Knex, user: IUser, externalUsers: IUser[]) {
  const friendships = [];

  for (const externalUser of externalUsers) {
    friendships.push({
      date: newCreationDate(),
      srcId: user.id,
      targetId: externalUser.id
    } as IFriendship);
  }

  await db(DbTable.Friendships).insert(friendships);
}

async function newReviews(
  db: Knex,
  user: IUser,
  externalTrackables: ITrackable[]
) {
  const externalGoals = externalTrackables.filter(
    trackable => trackable.statusId === TrackableStatus.PendingReview
  );

  for (const externalGoal of externalGoals) {
    if (Faker.random.boolean()) {
      await newApproval(db, user, externalGoal);
    } else {
      await newRejection(db, user, externalGoal);
    }
  }
}

async function newApproval(db: Knex, user: IUser, externalGoal: ITrackable) {
  await db(DbTable.Reviews).insert({
    date: newCreationDate(),
    difficulty: newDifficulty(),
    statusId: ReviewStatus.Approved,
    trackableId: externalGoal.id,
    userId: user.id
  } as IApproval);
}

async function newRejection(db: Knex, user: IUser, externalGoal: ITrackable) {
  await db(DbTable.Reviews).insert({
    date: newCreationDate(),
    reasonId: newRejectReason(),
    statusId: ReviewStatus.Rejected,
    trackableId: externalGoal.id,
    userId: user.id
  } as IRejection);
}

async function newUser(db: Knex): Promise<IUser> {
  const avatar = await newAvatar(db);
  const rows = await db(DbTable.Users).insert(
    {
      avatarId: avatar.id,
      email: Faker.internet.email(),
      facebookAccessToken: Faker.random.alphaNumeric(256),
      facebookId: Faker.random.uuid(),
      name: Faker.name.findName(),
      rating: newRating(),
      rewardableReviewsLeft: Faker.random.number({ min: 0, max: 4 })
    } as IUser,
    "*"
  );
  const user = rows[0];
  await db(DbTable.Avatars)
    .update("userId", user.id)
    .where("id", avatar.id);
  return user;
}

async function newAvatar(db: Knex): Promise<IAvatar> {
  const rows = await db(DbTable.Avatars).insert(
    {
      clientId: newClientId(),
      urlMedium: "https://loremflickr.com/256/256/cat",
      urlSmall: "https://loremflickr.com/48/48/cat"
    } as IAvatar,
    "*"
  );
  return rows[0];
}

async function newTrackables(db: Knex, user: IUser): Promise<ITrackable[]> {
  const trackableGroups = await Promise.all([
    newTaskGoals(db, user),
    newNumericalGoals(db, user),
    newCounters(db, user),
    newGymExercises(db, user),
    newAggregates(db, user)
  ]);
  const allTrackables = [];

  for (const groupTrackables of trackableGroups) {
    allTrackables.push(...groupTrackables);
  }

  return allTrackables;
}

async function newAggregates(db: Knex, user: IUser): Promise<IAggregate[]> {
  const promises = [];

  for (let i = 0; i < 2; ++i) {
    promises.push(
      newAggregate(db, [
        await newCounter(db, user),
        await newCounter(db, user)
      ]),
      newAggregate(db, [
        await newNumericalGoal(db, user),
        await newTaskGoal(db, user)
      ])
    );
  }

  return await Promise.all(promises);
}

async function newAggregate(
  db: Knex,
  children: IAggregateChildren
): Promise<IAggregate> {
  const { max: maxProgress, current: progress } = aggregateProgress(children);
  const rows = await db(DbTable.Trackables).insert(
    {
      clientId: newClientId(),
      creationDate: newCreationDate(),
      isPublic: Faker.random.boolean(),
      maxProgress,
      order: newOrder(),
      progress,
      statusId: TrackableStatus.Active,
      title: newTitle(),
      typeId: TrackableType.Aggregate,
      userId: children[0].userId
    } as IAggregate,
    "*"
  );
  const aggregate = rows[0];
  await db(DbTable.Trackables)
    .update({ parentId: aggregate.id } as IAggregatable)
    .whereIn("id", (children as ITrackable[]).map(child => child.id));
  return aggregate;
}

function newGymExercises(db: Knex, user: IUser): Promise<IGymExercise[]> {
  const promises = [];

  for (let i = 0; i < 8; ++i) {
    promises.push(newGymExercise(db, user));
  }

  return Promise.all(promises);
}

async function newGymExercise(db: Knex, user: IUser): Promise<IGymExercise> {
  const rows = await db(DbTable.Trackables).insert(
    {
      clientId: newClientId(),
      creationDate: newCreationDate(),
      iconId: await newIconId(db),
      isPublic: Faker.random.boolean(),
      order: newOrder(),
      statusId: TrackableStatus.Active,
      title: newTitle(),
      typeId: TrackableType.GymExercise,
      userId: user.id
    } as IGymExercise,
    "*"
  );
  const gymExercise = rows[0];
  await newGymExerciseEntries(db, gymExercise);
  return gymExercise;
}

function newGymExerciseEntries(db: Knex, gymExercise: ITrackable) {
  const entries = [];

  for (let i = 0; i < 128; ++i) {
    entries.push({
      clientId: newClientId(),
      date: Faker.date.recent(),
      gymExerciseId: gymExercise.id,
      repetitionCount: newRepetitionCount(),
      setCount: newSetCount(),
      userId: gymExercise.userId,
      weight: newWeight()
    } as IGymExerciseEntry);
  }

  return db(DbTable.GymExerciseEntries).insert(entries);
}

function newCounters(db: Knex, user: IUser): Promise<ICounter[]> {
  const promises = [];

  for (let i = 0; i < 8; ++i) {
    promises.push(newCounter(db, user));
  }

  return Promise.all(promises);
}

async function newCounter(db: Knex, user: IUser): Promise<ICounter> {
  const rows = await db(DbTable.Trackables).insert(
    {
      clientId: newClientId(),
      creationDate: newCreationDate(),
      iconId: await newIconId(db),
      isPublic: Faker.random.boolean(),
      order: newOrder(),
      progress: Faker.random.number(7777777),
      statusId: TrackableStatus.Active,
      title: newTitle(),
      typeId: TrackableType.Counter,
      userId: user.id
    } as ICounter,
    "*"
  );
  return rows[0];
}

async function newTaskGoals(db: Knex, user: IUser): Promise<ITaskGoal[]> {
  const allGoals = [];

  for (let i = 0; i < 8; ++i) {
    const batchGoals = await Promise.all([
      newTaskGoal(db, user),
      asExpiredTrackable(db, await newTaskGoal(db, user)),
      asPendingProofTrackable(db, await newTaskGoal(db, user)),
      asPendingReviewTrackable(db, await newTaskGoal(db, user)),
      asApprovedTrackable(db, await newTaskGoal(db, user)),
      asRejectedTrackable(db, await newTaskGoal(db, user))
    ]);
    allGoals.push(...batchGoals);
  }

  return allGoals;
}

async function newTaskGoal(db: Knex, user: IUser): Promise<ITaskGoal> {
  const maxProgress = Faker.random.number({ min: 1, max: 8 });
  const rows = await db(DbTable.Trackables).insert(
    {
      clientId: newClientId(),
      creationDate: newCreationDate(),
      deadlineDate: newDeadlineDate(),
      difficulty: newDifficulty(),
      iconId: await newIconId(db),
      isPublic: Faker.random.boolean(),
      maxProgress,
      order: newOrder(),
      progress: Faker.random.number(maxProgress - 1),
      progressDisplayModeId: newProgressDisplayModeId(),
      statusId: TrackableStatus.Active,
      title: newTitle(),
      typeId: TrackableType.TaskGoal,
      userId: user.id
    } as ITaskGoal,
    "*"
  );
  const goal = rows[0];
  await newTasks(db, goal);
  return goal;
}

async function newTasks(db: Knex, goal: ITaskGoal) {
  const tasks = [];

  for (let i = 0; i < goal.maxProgress; ++i) {
    tasks.push({
      clientId: newClientId(),
      goalId: goal.id,
      isDone: i < goal.progress ? true : false,
      order: i,
      title: newTitle(),
      userId: goal.userId
    } as ITask);
  }

  await db(DbTable.Tasks).insert(tasks);
}

async function newNumericalGoals(
  db: Knex,
  user: IUser
): Promise<INumericalGoal[]> {
  const allGoals = [];

  for (let i = 0; i < 8; ++i) {
    const batchGoals = await Promise.all([
      newNumericalGoal(db, user),
      asExpiredTrackable(db, await newNumericalGoal(db, user)),
      asPendingProofTrackable(db, await newNumericalGoal(db, user)),
      asPendingReviewTrackable(db, await newNumericalGoal(db, user)),
      asApprovedTrackable(db, await newNumericalGoal(db, user)),
      asRejectedTrackable(db, await newNumericalGoal(db, user))
    ]);
    allGoals.push(...batchGoals);
  }

  return allGoals;
}

async function newNumericalGoal(
  db: Knex,
  user: IUser
): Promise<INumericalGoal> {
  const maxProgress = Faker.random.number({ min: 1, max: 7777777 });
  const rows = await db(DbTable.Trackables).insert(
    {
      clientId: newClientId(),
      creationDate: newCreationDate(),
      deadlineDate: newDeadlineDate(),
      difficulty: newDifficulty(),
      iconId: await newIconId(db),
      isPublic: Faker.random.boolean(),
      maxProgress,
      order: newOrder(),
      progress: Faker.random.number(maxProgress - 1),
      progressDisplayModeId: newProgressDisplayModeId(),
      statusId: TrackableStatus.Active,
      title: newTitle(),
      typeId: TrackableType.NumericalGoal,
      userId: user.id
    } as INumericalGoal,
    "*"
  );
  return rows[0];
}

async function asExpiredTrackable(db: Knex, trackable: ITrackable) {
  const deadlineDate = Faker.date.recent();
  const rows = await db(DbTable.Trackables)
    .update(
      {
        deadlineDate,
        statusChangeDate: deadlineDate,
        statusId: TrackableStatus.Expired
      } as ITrackable & IGoal,
      "*"
    )
    .where("id", trackable.id);
  return rows[0];
}

async function asPendingProofTrackable(
  db: Knex,
  trackable: ITrackable & IGoal
) {
  await completeTasks(db, trackable);
  const statusChangeDate = Faker.date.recent();
  const rows = await db(DbTable.Trackables)
    .update(
      {
        achievementDate: Faker.date.between(
          trackable.creationDate,
          statusChangeDate
        ),
        progress: trackable.maxProgress,
        statusChangeDate,
        statusId: TrackableStatus.PendingProof
      } as ITrackable & IGoal,
      "*"
    )
    .where("id", trackable.id);
  return rows[0];
}

async function asPendingReviewTrackable(
  db: Knex,
  trackable: ITrackable & IGoal
) {
  await completeTasks(db, trackable);
  const asset = await newAsset(db, trackable.userId);
  const statusChangeDate = Faker.date.recent();
  const rows = await db(DbTable.Trackables)
    .update(
      {
        achievementDate: Faker.date.between(
          trackable.creationDate,
          statusChangeDate
        ),
        approveCount: newReviewCount(),
        isPublic: true,
        progress: trackable.maxProgress,
        proofPhotoId: asset.id,
        rejectCount: newReviewCount(),
        statusChangeDate,
        statusId: TrackableStatus.PendingReview
      } as ITrackable & IGoal,
      "*"
    )
    .where("id", trackable.id);
  return rows[0];
}

async function asApprovedTrackable(db: Knex, trackable: ITrackable & IGoal) {
  await completeTasks(db, trackable);
  const { isPublic } = trackable;
  const rejectCount = isPublic ? newReviewCount() + 1 : undefined;
  const asset = await newAsset(db, trackable.userId);
  const statusChangeDate = Faker.date.recent();
  const rows = await db(DbTable.Trackables)
    .update(
      {
        achievementDate: Faker.date.between(
          trackable.creationDate,
          statusChangeDate
        ),
        approveCount: isPublic
          ? Faker.random.number({
              max: rejectCount! * 4,
              min: rejectCount! * 2
            })
          : undefined,
        estimatedDifficulty: isPublic ? newDifficulty() : undefined,
        progress: trackable.maxProgress,
        proofPhotoId: asset.id,
        rating: isPublic ? newRating() : undefined,
        rejectCount,
        statusChangeDate,
        statusId: TrackableStatus.Approved
      } as ITrackable & IGoal,
      "*"
    )
    .where("id", trackable.id);
  return rows[0];
}

async function asRejectedTrackable(db: Knex, trackable: ITrackable & IGoal) {
  await completeTasks(db, trackable);
  const approveCount = newReviewCount() + 1;
  const asset = await newAsset(db, trackable.userId);
  const statusChangeDate = Faker.date.recent();
  const rows = await db(DbTable.Trackables)
    .update(
      {
        achievementDate: Faker.date.between(
          trackable.creationDate,
          statusChangeDate
        ),
        approveCount,
        estimatedDifficulty: newDifficulty(),
        isPublic: true,
        progress: trackable.maxProgress,
        proofPhotoId: asset.id,
        rejectCount: Faker.random.number({
          max: approveCount * 4,
          min: approveCount * 2
        }),
        statusChangeDate,
        statusId: TrackableStatus.Rejected
      } as ITrackable & IGoal,
      "*"
    )
    .where("id", trackable.id);
  return rows[0];
}

async function completeTasks(db: Knex, trackable: ITrackable) {
  if (trackable.typeId === TrackableType.TaskGoal) {
    await db(DbTable.Tasks)
      .update({ isDone: true })
      .where("goalId", trackable.id);
  }
}

async function newActivities(
  db: Knex,
  user: IUser,
  userTrackables: ITrackable[],
  externalTrackables: ITrackable[]
) {
  const externalGoals = externalTrackables.filter(
    trackable => trackable.statusId === TrackableStatus.PendingReview
  );
  const userGoals = userTrackables.filter(
    trackable =>
      trackable.typeId === TrackableType.NumericalGoal ||
      trackable.typeId === TrackableType.TaskGoal
  );
  const userGymExercises = userTrackables.filter(
    trackable => trackable.typeId === TrackableType.GymExercise
  );
  const userTaskGoals = userGoals.filter(
    goal => goal.typeId === TrackableType.TaskGoal
  );
  const userNumericalGoals = userGoals.filter(
    goal => goal.typeId === TrackableType.NumericalGoal
  );
  const userCounters = userTrackables.filter(
    goal => goal.typeId === TrackableType.Counter
  );
  const promises = [];

  for (let i = 0; i < 64; ++i) {
    const externalGoalReviewedPromise = newExternalGoalReviewedActivity(
      db,
      user,
      Faker.random.arrayElement(externalGoals)
    );
    const goalAchievedPromise = newGoalAchievedActivity(
      db,
      Faker.random.arrayElement(userGoals)
    );
    const goalRejectedPromise = newGoalRejectedActivity(
      db,
      Faker.random.arrayElement(userGoals)
    );
    const goalApprovedPromise = newGoalApprovedActivity(
      db,
      Faker.random.arrayElement(userGoals)
    );
    const numericalGoalProgressChangedPromise = newNumericalGoalProgressChangedActivity(
      db,
      Faker.random.arrayElement(userNumericalGoals) as INumericalGoal
    );
    const counterProgressChangedPromise = newCounterProgressChangedActivity(
      db,
      Faker.random.arrayElement(userCounters)
    );
    const trackableAddedPromise = newTrackableAddedActivity(
      db,
      Faker.random.arrayElement(userTrackables)
    );

    const userTaskGoal = Faker.random.arrayElement(userTaskGoals);
    const userTasks = await db(DbTable.Tasks).where("goalId", userTaskGoal.id);
    const taskGoalProgressChangedPromise = newTaskGoalProgressChangedActivity(
      db,
      Faker.random.arrayElement(userTasks),
      userTaskGoal
    );

    const userGymExercise = Faker.random.arrayElement(userGymExercises);
    const userGymExercieEntries = await db(DbTable.GymExerciseEntries).where(
      "gymExerciseId",
      userGymExercise.id
    );
    const gymExerciseEntryAddedPromise = newGymExerciseEntryAddedActivity(
      db,
      Faker.random.arrayElement(userGymExercieEntries),
      userGymExercise
    );

    promises.push(
      Promise.all([
        externalGoalReviewedPromise,
        goalAchievedPromise,
        goalRejectedPromise,
        goalApprovedPromise,
        gymExerciseEntryAddedPromise,
        taskGoalProgressChangedPromise,
        numericalGoalProgressChangedPromise,
        counterProgressChangedPromise,
        trackableAddedPromise
      ])
    );
  }

  await Promise.all(promises);
}

async function newTrackableAddedActivity(db: Knex, trackable: ITrackable) {
  await db(DbTable.Activities).insert({
    date: newCreationDate(),
    isPublic: trackable.isPublic,
    trackableId: trackable.id,
    typeId: ActivityType.TrackableAdded,
    userId: trackable.userId
  } as ITrackableAddedActivity);
}

async function newCounterProgressChangedActivity(
  db: Knex,
  counter: ITrackable
) {
  await db(DbTable.Activities).insert({
    date: newCreationDate(),
    isPublic: counter.isPublic,
    progressDelta: Faker.random.number({ min: 1, max: 7777777 }),
    trackableId: counter.id,
    typeId: ActivityType.CounterProgressChanged,
    userId: counter.userId
  } as ICounterProgressChangedActivity);
}

async function newNumericalGoalProgressChangedActivity(
  db: Knex,
  goal: INumericalGoal
) {
  await db(DbTable.Activities).insert({
    date: newCreationDate(),
    isPublic: goal.isPublic,
    progressDelta: Faker.random.number({ min: 1, max: goal.maxProgress }),
    trackableId: goal.id,
    typeId: ActivityType.NumericalGoalProgressChanged,
    userId: goal.userId
  } as INumericalGoalProgressChangedActivity);
}

async function newTaskGoalProgressChangedActivity(
  db: Knex,
  task: ITask,
  goal: ITrackable
) {
  await db(DbTable.Activities).insert({
    date: newCreationDate(),
    isPublic: goal.isPublic,
    taskId: task.id,
    trackableId: task.goalId,
    typeId: ActivityType.TaskGoalProgressChanged,
    userId: task.userId
  } as ITaskGoalProgressChangedActivity);
}

async function newExternalGoalReviewedActivity(
  db: Knex,
  user: IUser,
  goal: ITrackable
) {
  await db(DbTable.Activities).insert({
    date: newCreationDate(),
    isPublic: true,
    ratingDelta: Faker.random.boolean() ? bonusRatingForReview : 0,
    reviewStatusId: newReviewStatusId(),
    trackableId: goal.id,
    typeId: ActivityType.ExternalGoalReviewed,
    userId: user.id
  } as IExternalGoalReviewedActivity);
}

async function newGoalAchievedActivity(db: Knex, goal: ITrackable) {
  await db(DbTable.Activities).insert({
    date: newCreationDate(),
    isPublic: goal.isPublic,
    trackableId: goal.id,
    typeId: ActivityType.GoalAchieved,
    userId: goal.userId
  } as IGoalAchievedActivity);
}

async function newGoalRejectedActivity(db: Knex, goal: ITrackable) {
  await db(DbTable.Activities).insert({
    date: newCreationDate(),
    isPublic: true,
    trackableId: goal.id,
    typeId: ActivityType.GoalRejected,
    userId: goal.userId
  } as IGoalRejectedActivity);
}

async function newGoalApprovedActivity(db: Knex, goal: ITrackable) {
  await db(DbTable.Activities).insert({
    date: newCreationDate(),
    isPublic: goal.isPublic,
    ratingDelta: goal.isPublic ? Faker.random.number() : undefined,
    trackableId: goal.id,
    typeId: ActivityType.GoalApproved,
    userId: goal.userId
  } as IGoalApprovedActivity);
}

async function newGymExerciseEntryAddedActivity(
  db: Knex,
  gymExercieEntry: IGymExerciseEntry,
  gymExercise: ITrackable
) {
  await db(DbTable.Activities).insert({
    date: newCreationDate(),
    gymExerciseEntryId: gymExercieEntry.id,
    isPublic: gymExercise.isPublic,
    trackableId: gymExercieEntry.gymExerciseId,
    typeId: ActivityType.GymExerciseEntryAdded,
    userId: gymExercieEntry.userId
  } as IGymExerciseEntryAddedActivity);
}

async function newAsset(db: Knex, userId: ID) {
  const rows = await db(DbTable.Assets).insert(
    {
      clientId: newClientId(),
      urlMedium: "https://loremflickr.com/480/480/cat",
      userId
    } as IAsset,
    "*"
  );
  return rows[0];
}

async function newIconId(db: Knex) {
  const icon = await db(DbTable.Icons)
    .where("name", "cow")
    .first();
  return icon.id;
}

function newOrder() {
  return Faker.random.number({ min: 0, max: Date.now() });
}

function newProgressDisplayModeId() {
  return Faker.random.arrayElement([
    ProgressDisplayMode.Percentage,
    ProgressDisplayMode.Value
  ]);
}

function newTitle() {
  return Faker.lorem.sentence();
}

function newDeadlineDate() {
  return Faker.random.arrayElement([undefined, Faker.date.future()]);
}

function newCreationDate() {
  return Faker.date.past();
}

function newDifficulty() {
  return Faker.random.arrayElement([
    Difficulty.Easy,
    Difficulty.Medium,
    Difficulty.Hard,
    Difficulty.Impossible
  ]);
}

function newRating() {
  return Faker.random.number({ min: 0, max: 7777 });
}

function newReviewCount() {
  return Faker.random.number(7777);
}

function newReviewStatusId() {
  return Faker.random.arrayElement([
    ReviewStatus.Approved,
    ReviewStatus.Rejected
  ]);
}

function newRepetitionCount() {
  return Faker.random.number({ min: 1, max: 128 });
}

function newSetCount() {
  return Faker.random.number({ min: 1, max: 16 });
}

function newWeight() {
  return Faker.random.number({ min: 0, max: 512 });
}

function newClientId() {
  return Faker.random.uuid();
}

function newRejectReason() {
  return Faker.random.arrayElement([
    RejectReason.Abuse,
    RejectReason.Fake,
    RejectReason.Other,
    RejectReason.Spam
  ]);
}

function nweReportReason() {
  return Faker.random.arrayElement([
    ReportReason.Abuse,
    ReportReason.Cheating,
    ReportReason.Other,
    ReportReason.Spam
  ]);
}

export { seed };
