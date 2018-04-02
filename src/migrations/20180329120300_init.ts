import * as Knex from "knex";

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
    { id: 3, name: "Other" }
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

function createAvatars(knex: Knex) {
  return knex.schema.createTable("avatars", table => {
    table.increments("id").unsigned();
    table.string("urlSmall").notNullable();
    table.string("urlMedium").notNullable();
  });
}

function createAssets(knex: Knex) {
  return knex.schema.createTable("assets", table => {
    table.increments("id").unsigned();
    table.string("urlMedium").notNullable();
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
      .timestamp("creationDate", true)
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .string("facebookId")
      .notNullable()
      .unique();
    table.string("facebookAccessToken").notNullable();
    table
      .integer("avatarId")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("avatars")
      .index();
    table
      .integer("rating")
      .notNullable()
      .unsigned()
      .defaultTo(0);
  });
}

function createTrackables(knex: Knex) {
  return knex.schema.createTable("trackables", table => {
    table.increments("id").unsigned();
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
    table
      .boolean("isPublic")
      .notNullable()
      .index();
    table.timestamp("statusChangeDate", true);
    table.timestamp("achievementDate", true);
    table.dateTime("deadlineDate");
    table
      .timestamp("creationDate", true)
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .integer("userId")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("users")
      .index();
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
      .inTable("icons")
      .index();
    table.specificType("progress", "double precision");
    table.specificType("maxProgress", "double precision");
    table
      .integer("progressDisplayModeId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("progressDisplayModes");
    table
      .integer("difficulty")
      .unsigned()
      .notNullable();
    table.integer("estimatedDifficulty").unsigned();
    table
      .integer("proofPhotoId")
      .unsigned()
      .references("id")
      .inTable("assets")
      .index();
    table.integer("rating").unsigned();
    table.integer("approveCount").unsigned();
    table.integer("rejectCount").unsigned();
  });
}

function createTasks(knex: Knex) {
  return knex.schema.createTable("tasks", table => {
    table.increments("id").unsigned();
    table
      .timestamp("creationDate", true)
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
      .index();
  });
}

function createGymExerciseEntries(knex: Knex) {
  return knex.schema.createTable("gymExerciseEntries", table => {
    table.increments("id").unsigned();
    table
      .timestamp("date", true)
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .integer("gymExerciseId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("trackables")
      .index();
    table.integer("setCount").notNullable();
    table.integer("repetitionCount").notNullable();
    table.integer("weight").notNullable();
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
      .timestamp("date", true)
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .index();
    table
      .integer("trackableId")
      .unsigned()
      .references("id")
      .inTable("trackables");
    table.boolean("isApprove");
    table.integer("ratingDelta");
    table.specificType("progressDelta", "double precision");
    table
      .integer("gymExerciseEntryId")
      .unsigned()
      .references("id")
      .inTable("gymExerciseEntries");
    table
      .integer("taskId")
      .unsigned()
      .references("id")
      .inTable("tasks");
  });
}

async function createUserApproves(knex: Knex) {
  await knex.schema.createTable("userApproves", table => {
    table
      .timestamp("date", true)
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table
      .integer("trackableId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("trackables");
    table
      .integer("difficulty")
      .notNullable()
      .unsigned();
    table.primary(["trackableId", "userId"]);
  });
}

async function createUserRejects(knex: Knex) {
  await knex.schema.createTable("userRejects", table => {
    table
      .timestamp("date", true)
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table
      .integer("trackableId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("trackables");
    table
      .integer("reasonId")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("rejectReasons");
    table.primary(["trackableId", "userId"]);
  });
}

async function createReportedUsers(knex: Knex) {
  await knex.schema.createTable("reportedUsers", table => {
    table
      .timestamp("date", true)
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
      .inTable("users");
    table
      .integer("reportedId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table.primary(["reporterId", "reportedId"]);
  });
}

async function createMutedUsers(knex: Knex) {
  await knex.schema.createTable("mutedUsers", table => {
    table
      .timestamp("date", true)
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .integer("srcId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table
      .integer("targetId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table.primary(["srcId", "targetId"]);
  });
}

async function createFriends(knex: Knex) {
  await knex.schema.createTable("friends", table => {
    table
      .timestamp("date", true)
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .integer("srcId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table
      .integer("targetId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table.primary(["srcId", "targetId"]);
  });
}

exports.up = async (knex: Knex) => {
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
  await createUserApproves(knex);
  await createUserRejects(knex);
  await createReportedUsers(knex);
  await createMutedUsers(knex);
  await createFriends(knex);
};

exports.down = async (knex: Knex) => {
  const tables = [
    "friends",
    "mutedUsers",
    "reportedUsers",
    "userApproves",
    "userRejects",
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
    "rejectReasons"
  ];

  for (const table of tables) {
    await knex.schema.dropTable(table);
  }
};
