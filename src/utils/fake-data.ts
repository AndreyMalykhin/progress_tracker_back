import Faker from "faker";

const ReviewStatus = {
  Approved: "Approved",
  Rejected: "Rejected"
};

const TrackableStatus = {
  Active: "Active",
  Approved: "Approved",
  Expired: "Expired",
  PendingProof: "PendingProof",
  PendingReview: "PendingReview",
  Rejected: "Rejected"
};

const Audience = {
  Friends: "Friends",
  Global: "Global",
  Me: "Me"
};

const Difficulty = {
  Easy: "Easy",
  Hard: "Hard",
  Impossible: "Impossible",
  Medium: "Medium"
};

const ProgressDisplayMode = {
  Percentage: "Percentage",
  Value: "Value"
};

function newUsers(count: number) {
  const users = [];

  for (let i = 0; i < count; ++i) {
    users.push(newUser());
  }

  users.sort((lhs, rhs) => {
    const result = rhs.rating - lhs.rating;

    if (result === 0) {
      return 0;
    }

    return result < 0 ? -1 : 1;
  });
  return users.map(user => {
    return { cursor: user.rating, node: user };
  });
}

function newActiveTrackables(count: number) {
  const trackables = [];

  for (let i = 0; i < count; ++i) {
    const status = Faker.random.arrayElement([
      TrackableStatus.Active,
      TrackableStatus.PendingProof
    ]);
    const trackable = newTrackable(status);
    trackables.push(trackable);
  }

  trackables.sort((lhs, rhs) => {
    const result = rhs.order - lhs.order;

    if (result === 0) {
      return 0;
    }

    return result < 0 ? -1 : 1;
  });
  return trackables.map(trackable => {
    return { cursor: trackable.order, node: trackable };
  });
}

function newArchivedTrackables(count: number, status: string) {
  const trackables = [];

  for (let i = 0; i < count; ++i) {
    const trackable = newTrackable(status);
    trackables.push(trackable);
  }

  trackables.sort((lhs, rhs) => {
    const result = rhs.statusChangeDate! - lhs.statusChangeDate!;

    if (result === 0) {
      return 0;
    }

    return result < 0 ? -1 : 1;
  });
  return trackables.map(trackable => {
    return { cursor: trackable.statusChangeDate, node: trackable };
  });
}

function newPendingReviewTrackables(count: number) {
  const trackables = [];

  for (let i = 0; i < count; ++i) {
    const trackable = newTrackable(TrackableStatus.PendingReview);
    trackables.push(trackable);
  }

  trackables.sort((lhs, rhs) => {
    const result = rhs.statusChangeDate! - lhs.statusChangeDate!;

    if (result === 0) {
      return 0;
    }

    return result < 0 ? -1 : 1;
  });
  return trackables.map(trackable => {
    return { cursor: trackable.statusChangeDate, node: trackable };
  });
}

function newActivities(count: number) {
  const activities = [];

  for (let i = 0; i < count; ++i) {
    activities.push(newActivity());
  }

  activities.sort((lhs, rhs) => {
    const result = rhs.date - lhs.date;

    if (result === 0) {
      return 0;
    }

    return result < 0 ? -1 : 1;
  });
  return activities.map(activity => {
    return { cursor: activity.date, node: activity };
  });
}

function newTrackable(status: string) {
  let factories;

  switch (status) {
    case TrackableStatus.Active:
      factories = [
        newTaskGoal,
        newNumericalGoal,
        newGymExercise,
        newCounter,
        newAggregate
      ];
      break;
    case TrackableStatus.Approved:
    case TrackableStatus.Expired:
    case TrackableStatus.Rejected:
    case TrackableStatus.PendingProof:
    case TrackableStatus.PendingReview:
      factories = [newTaskGoal, newNumericalGoal];
      break;
    default:
      throw new Error("Unexpected status: " + status);
  }
  const trackable: any = Faker.random.arrayElement(factories)();

  switch (status) {
    case TrackableStatus.Active:
      break;
    case TrackableStatus.Approved:
      trackable.progress = trackable.maxProgress;
      trackable.statusChangeDate = Faker.date.past().getTime();
      trackable.achievementDate = Faker.date
        .past(1, new Date(trackable.statusChangeDate))
        .getTime();
      trackable.proofPhotoUrlMedium = newProofPhoto();
      trackable.rejectCount = Faker.random.number({ min: 0, max: 777 });
      trackable.approveCount = Faker.random.number({
        max: (trackable.rejectCount + 1) * 10,
        min: trackable.rejectCount + 1
      });
      trackable.rating = Faker.random.number({ min: 0, max: 7777 });
      break;
    case TrackableStatus.Rejected:
      trackable.progress = trackable.maxProgress;
      trackable.statusChangeDate = Faker.date.past().getTime();
      trackable.achievementDate = Faker.date
        .past(1, new Date(trackable.statusChangeDate))
        .getTime();
      trackable.proofPhotoUrlMedium = newProofPhoto();
      trackable.approveCount = Faker.random.number({ min: 0, max: 7777 });
      trackable.rejectCount = Faker.random.number({
        max: (trackable.approveCount + 1) * 10,
        min: trackable.approveCount + 1
      });
      break;
    case TrackableStatus.Expired:
      trackable.deadlineDate = Faker.date.recent().getTime();
      trackable.statusChangeDate = trackable.deadlineDate;
      break;
    case TrackableStatus.PendingProof:
      trackable.progress = trackable.maxProgress;
      trackable.statusChangeDate = Faker.date.past().getTime();
      trackable.achievementDate = Faker.date
        .past(1, new Date(trackable.statusChangeDate))
        .getTime();

      if (trackable.__typename === "TaskGoal") {
        for (const task of trackable.tasks) {
          task.isDone = true;
        }
      }
      break;
    case TrackableStatus.PendingReview:
      trackable.progress = trackable.maxProgress;
      trackable.statusChangeDate = Faker.date.past().getTime();
      trackable.achievementDate = Faker.date
        .past(1, new Date(trackable.statusChangeDate))
        .getTime();
      trackable.proofPhotoUrlMedium = newProofPhoto();
      trackable.approveCount = Faker.random.number({ min: 0, max: 7777 });
      trackable.rejectCount = Faker.random.number({ min: 0, max: 7777 });
      trackable.myReviewStatus = Faker.random.arrayElement([
        ReviewStatus.Approved,
        ReviewStatus.Rejected,
        null
      ]);
      break;
    default:
      throw new Error("Unexpected status: " + status);
  }

  trackable.status = status;
  return trackable;
}

function newTaskGoal() {
  const maxProgress = Faker.random.number({ min: 1, max: 8 });
  const progress = Faker.random.number(maxProgress - 1);
  const creationDate = Faker.date.past().getTime();
  const trackableId = Faker.random.uuid();
  const tasks = [];

  for (let i = 0; i < maxProgress; ++i) {
    const task = newTask();
    task.goal.id = trackableId;
    task.isDone = i < progress ? true : false;
    tasks.push(task);
  }

  tasks.sort((lhs, rhs) => {
    if (lhs.isDone === rhs.isDone) {
      return 0;
    }

    return lhs.isDone ? 1 : -1;
  });
  return {
    __typename: "TaskGoal",
    approveCount: null,
    creationDate,
    deadlineDate: newDeadlineDate(),
    difficulty: newDifficulty(),
    iconName: newIconName(),
    id: trackableId,
    isPublic: Faker.random.boolean(),
    maxProgress,
    myReviewStatus: null,
    order: creationDate,
    parent: null,
    progress,
    progressDisplayMode: newProgressDisplayMode(),
    proofPhotoUrlMedium: null,
    rating: null,
    rejectCount: null,
    status: TrackableStatus.Active,
    statusChangeDate: null,
    tasks,
    title: Faker.lorem.sentence(),
    user: newUser()
  };
}

function newTask() {
  return {
    __typename: "Task",
    goal: {
      __typename: "TaskGoal",
      id: Faker.random.uuid()
    },
    id: Faker.random.uuid(),
    isDone: Faker.random.boolean(),
    title: Faker.lorem.sentence()
  };
}

function newNumericalGoal() {
  const maxProgress = Faker.random.number({ min: 1, max: 777777 });
  const creationDate = Faker.date.past().getTime();
  return {
    __typename: "NumericalGoal",
    approveCount: null,
    creationDate,
    deadlineDate: newDeadlineDate(),
    difficulty: newDifficulty(),
    iconName: newIconName(),
    id: Faker.random.uuid(),
    isPublic: Faker.random.boolean(),
    maxProgress,
    myReviewStatus: null,
    order: creationDate,
    parent: null,
    progress: Faker.random.number(maxProgress - 1),
    progressDisplayMode: newProgressDisplayMode(),
    proofPhotoUrlMedium: null,
    rating: null,
    rejectCount: null,
    status: TrackableStatus.Active,
    statusChangeDate: null,
    title: Faker.lorem.sentence(),
    user: newUser()
  };
}

function newCounter() {
  const creationDate = Faker.date.past().getTime();
  return {
    __typename: "Counter",
    creationDate,
    iconName: newIconName(),
    id: Faker.random.uuid(),
    isPublic: Faker.random.boolean(),
    order: creationDate,
    parent: null,
    progress: Faker.random.number(777777),
    status: TrackableStatus.Active,
    statusChangeDate: null,
    title: Faker.lorem.sentence(),
    user: newUser()
  };
}

function newGymExercise() {
  const creationDate = Faker.date.past().getTime();
  const recentEntries = [];
  const dayCount = 4;
  const entryCount = Faker.random.number(8 * dayCount);
  const trackableId = Faker.random.uuid();

  for (let i = 0; i < entryCount; ++i) {
    const entry = newGymExerciseEntry();
    entry.gymExercise.id = trackableId;
    entry.date = Faker.date.recent(dayCount).getTime();
    recentEntries.push(entry);
  }

  recentEntries.sort((lhs, rhs) => {
    if (lhs.date === rhs.date) {
      return 0;
    }

    return rhs.date - lhs.date;
  });
  return {
    __typename: "GymExercise",
    creationDate,
    iconName: newIconName(),
    id: trackableId,
    isPublic: Faker.random.boolean(),
    order: creationDate,
    parent: null,
    recentEntries,
    status: TrackableStatus.Active,
    statusChangeDate: null,
    title: Faker.lorem.sentence(),
    user: newUser()
  };
}

function newGymExerciseEntry() {
  return {
    __typename: "GymExerciseEntry",
    date: Faker.date.past().getTime(),
    gymExercise: {
      __typename: "GymExercise",
      id: Faker.random.uuid()
    },
    id: Faker.random.uuid(),
    repetitionCount: Faker.random.number({ min: 1, max: 64 }),
    setCount: 1,
    weight: Faker.random.number(320)
  };
}

function newAggregate() {
  const isCounter = Faker.random.boolean();
  const creationDate = Faker.date.past().getTime();
  const children = [];
  const childrenCount = Faker.random.number({ min: 1, max: 4 });
  const maxProgress = isCounter ? null : 1;
  let progress = 0;
  const trackableId = Faker.random.uuid();

  for (let i = 0; i < childrenCount; ++i) {
    const childFactory = isCounter
      ? newCounter
      : Faker.random.arrayElement([newTaskGoal, newNumericalGoal]);
    const child: any = childFactory();
    child.parent = { __typename: "Aggregate", id: trackableId };
    progress += isCounter
      ? child.progress
      : child.progress / child.maxProgress / childrenCount;
    children.push(child);
  }

  return {
    __typename: "Aggregate",
    children,
    creationDate,
    id: trackableId,
    isPublic: Faker.random.boolean(),
    maxProgress,
    order: creationDate,
    progress,
    status: TrackableStatus.Active,
    statusChangeDate: null,
    title: Faker.lorem.sentence(),
    user: newUser()
  };
}

function newActivity() {
  const activity = Faker.random.arrayElement([
    newTrackableAddedActivity,
    newCounterProgressChangedActivity,
    newNumericalGoalProgressChangedActivity,
    newTaskGoalProgressChangedActivity,
    newGymExerciseEntryAddedActivity,
    newGoalApprovedActivity,
    newGoalRejectedActivity,
    newGoalAchievedActivity,
    newGoalExpiredActivity,
    newExternalGoalReviewedActivity
  ])();
  return activity;
}

function newTrackableAddedActivity() {
  return {
    __typename: "TrackableAddedActivity",
    date: Faker.date.past().getTime(),
    id: Faker.random.uuid(),
    trackable: newCounter(),
    user: newUser()
  };
}

function newCounterProgressChangedActivity() {
  return {
    __typename: "CounterProgressChangedActivity",
    date: Faker.date.past().getTime(),
    delta: Faker.random.number(777777),
    id: Faker.random.uuid(),
    trackable: newCounter(),
    user: newUser()
  };
}

function newNumericalGoalProgressChangedActivity() {
  return {
    __typename: "NumericalGoalProgressChangedActivity",
    date: Faker.date.past().getTime(),
    delta: Faker.random.number(777777),
    id: Faker.random.uuid(),
    trackable: newNumericalGoal(),
    user: newUser()
  };
}

function newTaskGoalProgressChangedActivity() {
  return {
    __typename: "TaskGoalProgressChangedActivity",
    date: Faker.date.past().getTime(),
    id: Faker.random.uuid(),
    task: newTask(),
    trackable: newTaskGoal(),
    user: newUser()
  };
}

function newGymExerciseEntryAddedActivity() {
  return {
    __typename: "GymExerciseEntryAddedActivity",
    date: Faker.date.past().getTime(),
    entry: newGymExerciseEntry(),
    id: Faker.random.uuid(),
    trackable: newGymExercise(),
    user: newUser()
  };
}

function newGoalApprovedActivity() {
  return {
    __typename: "GoalApprovedActivity",
    date: Faker.date.past().getTime(),
    id: Faker.random.uuid(),
    ratingDelta: Faker.random.number(1),
    trackable: newNumericalGoal(),
    user: newUser()
  };
}

function newGoalRejectedActivity() {
  return {
    __typename: "GoalRejectedActivity",
    date: Faker.date.past().getTime(),
    id: Faker.random.uuid(),
    trackable: newNumericalGoal(),
    user: newUser()
  };
}

function newGoalAchievedActivity() {
  return {
    __typename: "GoalAchievedActivity",
    date: Faker.date.past().getTime(),
    id: Faker.random.uuid(),
    trackable: newNumericalGoal(),
    user: newUser()
  };
}

function newGoalExpiredActivity() {
  return {
    __typename: "GoalExpiredActivity",
    date: Faker.date.past().getTime(),
    id: Faker.random.uuid(),
    trackable: newNumericalGoal(),
    user: newUser()
  };
}

function newExternalGoalReviewedActivity() {
  const isApprove = Faker.random.boolean();
  return {
    __typename: "ExternalGoalReviewedActivity",
    date: Faker.date.past().getTime(),
    id: Faker.random.uuid(),
    isApprove,
    ratingDelta: isApprove ? Faker.random.number(7777) : null,
    trackable: newNumericalGoal(),
    user: newUser()
  };
}

function newUser() {
  return {
    __typename: "User",
    avatarUrlMedium: newAvatarMedium(),
    avatarUrlSmall: newAvatarSmall(),
    id: Faker.random.uuid(),
    isMuted: Faker.random.boolean(),
    isReported: Faker.random.boolean(),
    name: Faker.name.findName(),
    rating: Faker.random.number(777777),
    rewardableReviewsLeft: Faker.random.number(4)
  };
}

function newIconName() {
  return Faker.random.arrayElement([
    "counter",
    "format-list-bulleted",
    "numeric",
    "dumbbell"
  ]);
}

function newDifficulty() {
  return Faker.random.arrayElement([
    Difficulty.Easy,
    Difficulty.Medium,
    Difficulty.Hard,
    Difficulty.Impossible
  ]);
}

function newDeadlineDate() {
  return Faker.random.arrayElement([null, Faker.date.future().getTime()]);
}

function newProgressDisplayMode() {
  return Faker.random.arrayElement([
    ProgressDisplayMode.Percentage,
    ProgressDisplayMode.Value
  ]);
}

function newAvatarSmall() {
  return "https://loremflickr.com/128/128/cat";
}

function newAvatarMedium() {
  return "https://loremflickr.com/512/512/cat";
}

function newProofPhoto() {
  return "https://loremflickr.com/512/512/cat";
}

export {
  newActiveTrackables,
  newArchivedTrackables,
  newPendingReviewTrackables,
  newActivities,
  newUsers,
  newUser,
  TrackableStatus,
  Audience,
  ReviewStatus
};
