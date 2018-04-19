import * as Knex from "knex";

async function createReviewStatuses(knex: Knex) {
  await knex.schema.createTable("reviewStatuses", table => {
    table
      .integer("id")
      .unsigned()
      .primary();
    table
      .string("name", 32)
      .notNullable()
      .unique();
  });

  await knex("reviewStatuses").insert([
    { id: 1, name: "Approved" },
    { id: 2, name: "Rejected" }
  ]);
}

async function createRejectReasons(knex: Knex) {
  await knex.schema.createTable("rejectReasons", table => {
    table
      .integer("id")
      .unsigned()
      .primary();
    table
      .string("name", 32)
      .notNullable()
      .unique();
  });

  await knex("rejectReasons").insert([
    { id: 1, name: "Abuse" },
    { id: 2, name: "Spam" },
    { id: 3, name: "Other" },
    { id: 4, name: "Fake" }
  ]);
}

async function createReportReasons(knex: Knex) {
  await knex.schema.createTable("reportReasons", table => {
    table
      .integer("id")
      .unsigned()
      .primary();
    table
      .string("name", 32)
      .notNullable()
      .unique();
  });

  await knex("reportReasons").insert([
    { id: 1, name: "Cheating" },
    { id: 2, name: "Abuse" },
    { id: 3, name: "Spam" },
    { id: 4, name: "Other" }
  ]);
}

async function createProgressDisplayModes(knex: Knex) {
  await knex.schema.createTable("progressDisplayModes", table => {
    table
      .integer("id")
      .unsigned()
      .primary();
    table
      .string("name", 32)
      .notNullable()
      .unique();
  });

  await knex("progressDisplayModes").insert([
    { id: 1, name: "Value" },
    { id: 2, name: "Percentage" }
  ]);
}

async function createActivityTypes(knex: Knex) {
  await knex.schema.createTable("activityTypes", table => {
    table
      .integer("id")
      .unsigned()
      .primary();
    table
      .string("name", 64)
      .notNullable()
      .unique();
  });

  await knex("activityTypes").insert([
    { id: 1, name: "ExternalGoalReviewed" },
    { id: 2, name: "GoalAchieved" },
    { id: 3, name: "GoalRejected" },
    { id: 4, name: "GoalApproved" },
    { id: 5, name: "GymExerciseEntryAdded" },
    { id: 6, name: "TaskGoalProgressChanged" },
    { id: 7, name: "NumericalGoalProgressChanged" },
    { id: 8, name: "CounterProgressChanged" },
    { id: 9, name: "TrackableAdded" }
  ]);
}

async function createTrackableTypes(knex: Knex) {
  await knex.schema.createTable("trackableTypes", table => {
    table
      .integer("id")
      .unsigned()
      .primary();
    table
      .string("name", 32)
      .notNullable()
      .unique();
  });

  await knex("trackableTypes").insert([
    { id: 1, name: "Counter" },
    { id: 2, name: "GymExercise" },
    { id: 3, name: "NumericalGoal" },
    { id: 4, name: "TaskGoal" },
    { id: 5, name: "Aggregate" }
  ]);
}

async function createTrackableStatuses(knex: Knex) {
  await knex.schema.createTable("trackableStatuses", table => {
    table
      .integer("id")
      .unsigned()
      .primary();
    table
      .string("name", 32)
      .notNullable()
      .unique();
  });

  await knex("trackableStatuses").insert([
    { id: 1, name: "Active" },
    { id: 2, name: "Expired" },
    { id: 3, name: "PendingProof" },
    { id: 4, name: "PendingReview" },
    { id: 5, name: "Approved" },
    { id: 6, name: "Rejected" }
  ]);
}

async function createAvatars(knex: Knex) {
  await knex.schema.createTable("avatars", table => {
    table.increments("id").unsigned();
    table.uuid("clientId");
    table.integer("userId").unsigned();
    table.string("urlSmall").notNullable();
    table.string("urlMedium").notNullable();
    table.unique(["userId", "clientId"]);
  });
  await knex("avatars").insert({
    id: 1,
    urlMedium: process.env.PT_DEFAULT_AVATAR_URL_MEDIUM,
    urlSmall: process.env.PT_DEFAULT_AVATAR_URL_SMALL
  });
  await knex.schema.raw('alter sequence "avatars_id_seq" restart with 128');
}

function createAssets(knex: Knex) {
  return knex.schema.createTable("assets", table => {
    table.increments("id").unsigned();
    table.uuid("clientId");
    table
      .integer("userId")
      .notNullable()
      .unsigned();
    table.string("urlMedium").notNullable();
    table.unique(["userId", "clientId"]);
  });
}

async function createIcons(knex: Knex) {
  await knex.schema.createTable("icons", table => {
    table.increments("id").unsigned();
    table
      .string("name", 32)
      .notNullable()
      .unique();
  });

  await knex("icons").insert([
    { name: "account-card-details" },
    { name: "airballoon" },
    { name: "airplane" },
    { name: "amazon" },
    { name: "android" },
    { name: "apple" },
    { name: "baby-buggy" },
    { name: "auto-fix" },
    { name: "bank" },
    { name: "basketball" },
    { name: "battery-charging" },
    { name: "beer" },
    { name: "beach" },
    { name: "bike" },
    { name: "bitcoin" },
    { name: "bone" },
    { name: "book-open-page-variant" },
    { name: "bowling" },
    { name: "broom" },
    { name: "brightness-3" },
    { name: "bus" },
    { name: "cake-variant" },
    { name: "camera" },
    { name: "cannabis" },
    { name: "car" },
    { name: "camcorder" },
    { name: "cat" },
    { name: "certificate" },
    { name: "church" },
    { name: "clock" },
    { name: "coffee" },
    { name: "counter" },
    { name: "cow" },
    { name: "crown" },
    { name: "diamond" },
    { name: "donkey" },
    { name: "dumbbell" },
    { name: "earth" },
    { name: "duck" },
    { name: "email" },
    { name: "emoticon-poop" },
    { name: "emoticon-cool" },
    { name: "emoticon-happy" },
    { name: "emoticon-sad" },
    { name: "facebook-box" },
    { name: "ferry" },
    { name: "fish" },
    { name: "football" },
    { name: "food-fork-drink" },
    { name: "format-list-bulleted" },
    { name: "gamepad-variant" },
    { name: "gas-station" },
    { name: "gauge" },
    { name: "gift" },
    { name: "golf" },
    { name: "google" },
    { name: "guitar-acoustic" },
    { name: "guitar-electric" },
    { name: "hamburger" },
    { name: "heart" },
    { name: "heart-broken" },
    { name: "help-circle" },
    { name: "home" },
    { name: "hook" },
    { name: "hospital" },
    { name: "human-male" },
    { name: "human-female" },
    { name: "ice-cream" },
    { name: "image" },
    { name: "incognito" },
    { name: "itunes" },
    { name: "karate" },
    { name: "kettle" },
    { name: "key" },
    { name: "ladybug" },
    { name: "laptop-mac" },
    { name: "leaf" },
    { name: "lightbulb" },
    { name: "linkedin-box" },
    { name: "lock" },
    { name: "magnify" },
    { name: "map" },
    { name: "matrix" },
    { name: "message-text" },
    { name: "needle" },
    { name: "ninja" },
    { name: "numeric" },
    { name: "palette" },
    { name: "panda" },
    { name: "parking" },
    { name: "pause-circle" },
    { name: "phone-classic" },
    { name: "piano" },
    { name: "pine-tree" },
    { name: "pistol" },
    { name: "playstation" },
    { name: "power" },
    { name: "printer" },
    { name: "pulse" },
    { name: "remote" },
    { name: "road" },
    { name: "rocket" },
    { name: "run-fast" },
    { name: "school" },
    { name: "sleep" },
    { name: "smoking" },
    { name: "soccer" },
    { name: "spray" },
    { name: "square-inc-cash" },
    { name: "sword" },
    { name: "swim" },
    { name: "target" },
    { name: "television-classic" },
    { name: "temperature-celsius" },
    { name: "tennis" },
    { name: "tooth" },
    { name: "traffic-light" },
    { name: "tram" },
    { name: "tshirt-crew" },
    { name: "twitter" },
    { name: "umbrella" },
    { name: "vk-circle" },
    { name: "walk" },
    { name: "watch" },
    { name: "water" },
    { name: "weight-kilogram" },
    { name: "wifi" },
    { name: "xbox" },
    { name: "yin-yang" }
  ]);
}

function createUsers(knex: Knex) {
  return knex.schema.createTable("users", table => {
    table.increments("id").unsigned();
    table.string("name", 128).notNullable();
    table
      .specificType("creationDate", "timestamp(3) with time zone")
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .string("facebookId")
      .notNullable()
      .unique();
    table.text("facebookAccessToken").notNullable();
    table
      .integer("avatarId")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("avatars");
    table
      .integer("rating")
      .notNullable()
      .unsigned()
      .defaultTo(0);
    table
      .integer("rewardableReviewsLeft")
      .notNullable()
      .unsigned();
  });
}

async function createTrackables(knex: Knex) {
  return knex.schema.createTable("trackables", table => {
    table.increments("id").unsigned();
    table.uuid("clientId");
    table
      .integer("typeId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("trackableTypes");
    table.string("title").notNullable();
    table
      .specificType("order", "double precision")
      .notNullable()
      .index();
    table
      .integer("statusId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("trackableStatuses")
      .index();
    table.boolean("isPublic").notNullable();
    table
      .specificType("statusChangeDate", "timestamp(3) with time zone")
      .index();
    table.specificType("achievementDate", "timestamp(3) with time zone");
    table.specificType("deadlineDate", "timestamp(3) with time zone");
    table
      .specificType("creationDate", "timestamp(3) with time zone")
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .integer("userId")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("cascade");
    table
      .integer("parentId")
      .unsigned()
      .references("id")
      .inTable("trackables")
      .index();
    table
      .integer("iconId")
      .unsigned()
      .references("id")
      .inTable("icons");
    table.specificType("progress", "double precision");
    table.specificType("maxProgress", "double precision");
    table
      .integer("progressDisplayModeId")
      .unsigned()
      .references("id")
      .inTable("progressDisplayModes");
    table.integer("difficulty").unsigned();
    table.integer("estimatedDifficulty").unsigned();
    table
      .integer("proofPhotoId")
      .unsigned()
      .references("id")
      .inTable("assets");
    table.integer("rating").unsigned();
    table.integer("approveCount").unsigned();
    table.integer("rejectCount").unsigned();
    table.unique(["userId", "clientId"]);
  });
}

function createTasks(knex: Knex) {
  return knex.schema.createTable("tasks", table => {
    table.increments("id").unsigned();
    table
      .integer("userId")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("cascade");
    table.uuid("clientId");
    table
      .specificType("creationDate", "timestamp(3) with time zone")
      .notNullable()
      .defaultTo(knex.fn.now());
    table.boolean("isDone").notNullable();
    table.string("title").notNullable();
    table
      .integer("goalId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("trackables")
      .onDelete("cascade")
      .index();
    table.unique(["userId", "clientId"]);
  });
}

function createGymExerciseEntries(knex: Knex) {
  return knex.schema.createTable("gymExerciseEntries", table => {
    table.increments("id").unsigned();
    table
      .integer("userId")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("cascade");
    table.uuid("clientId");
    table
      .specificType("date", "timestamp(3) with time zone")
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .integer("gymExerciseId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("trackables")
      .onDelete("cascade");
    table.integer("setCount").notNullable();
    table.integer("repetitionCount").notNullable();
    table.specificType("weight", "double precision").notNullable();
    table.index(["gymExerciseId", "date"]);
    table.unique(["userId", "clientId"]);
  });
}

function createActivities(knex: Knex) {
  return knex.schema.createTable("activities", table => {
    table.increments("id").unsigned();
    table
      .integer("typeId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("activityTypes");
    table
      .specificType("date", "timestamp(3) with time zone")
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("cascade");
    table
      .integer("trackableId")
      .unsigned()
      .references("id")
      .inTable("trackables")
      .onDelete("cascade");
    table
      .integer("reviewStatusId")
      .references("id")
      .inTable("reviewStatuses");
    table.integer("ratingDelta");
    table.specificType("progressDelta", "double precision");
    table
      .integer("gymExerciseEntryId")
      .unsigned()
      .references("id")
      .inTable("gymExerciseEntries")
      .onDelete("cascade");
    table
      .integer("taskId")
      .unsigned()
      .references("id")
      .inTable("tasks")
      .onDelete("cascade");
    table.boolean("isPublic").notNullable();
    table.index(["userId", "date"]);
  });
}

async function createReviews(knex: Knex) {
  await knex.schema.createTable("reviews", table => {
    table
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("cascade");
    table
      .integer("trackableId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("trackables")
      .onDelete("cascade");
    table
      .integer("reasonId")
      .unsigned()
      .references("id")
      .inTable("rejectReasons");
    table.integer("difficulty").unsigned();
    table
      .specificType("date", "timestamp(3) with time zone")
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .integer("statusId")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("reviewStatuses");
    table.primary(["trackableId", "userId"]);
  });
}

async function createUserReports(knex: Knex) {
  await knex.schema.createTable("userReports", table => {
    table
      .specificType("date", "timestamp(3) with time zone")
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .integer("reasonId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("reportReasons");
    table
      .integer("reporterId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("cascade");
    table
      .integer("reportedId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("cascade");
    table.primary(["reporterId", "reportedId"]);
  });
}

async function createMutes(knex: Knex) {
  await knex.schema.createTable("mutes", table => {
    table
      .specificType("date", "timestamp(3) with time zone")
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .integer("srcId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("cascade");
    table
      .integer("targetId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("cascade");
    table.primary(["srcId", "targetId"]);
  });
}

async function createFriendships(knex: Knex) {
  await knex.schema.createTable("friendships", table => {
    table
      .specificType("date", "timestamp(3) with time zone")
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .integer("srcId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("cascade");
    table
      .integer("targetId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("cascade");
    table.primary(["srcId", "targetId"]);
  });
}

async function createForeignKeys(knex: Knex) {
  await knex.schema.table("avatars", table => {
    table
      .foreign("userId")
      .references("id")
      .inTable("users")
      .onDelete("cascade");
  });
  await knex.schema.table("assets", table => {
    table
      .foreign("userId")
      .references("id")
      .inTable("users")
      .onDelete("cascade");
  });
}

async function up(knex: Knex) {
  await createReviewStatuses(knex);
  await createRejectReasons(knex);
  await createReportReasons(knex);
  await createProgressDisplayModes(knex);
  await createActivityTypes(knex);
  await createTrackableTypes(knex);
  await createTrackableStatuses(knex);
  await createAvatars(knex);
  await createAssets(knex);
  await createIcons(knex);
  await createUsers(knex);
  await createTrackables(knex);
  await createTasks(knex);
  await createGymExerciseEntries(knex);
  await createActivities(knex);
  await createReviews(knex);
  await createUserReports(knex);
  await createMutes(knex);
  await createFriendships(knex);
  await createForeignKeys(knex);
}

async function down(knex: Knex) {
  const tables = [
    "friendships",
    "mutes",
    "userReports",
    "reviews",
    "activities",
    "gymExerciseEntries",
    "tasks",
    "trackables",
    "users",
    "avatars",
    "icons",
    "assets",
    "trackableTypes",
    "trackableStatuses",
    "activityTypes",
    "progressDisplayModes",
    "reportReasons",
    "rejectReasons",
    "reviewStatuses"
  ];

  for (const table of tables) {
    await knex.schema.raw(`drop table if exists "${table}" cascade`);
  }
}

export { up, down };
