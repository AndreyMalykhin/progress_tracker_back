type IEnvConfig = typeof config;

const config = {
  assetsDirPath: process.env.PT_ASSETS_DIR_PATH!,
  avatarsDirPath: process.env.PT_AVATARS_DIR_PATH!,
  env: process.env.NODE_ENV!,
  facebookAppAccessToken: process.env.PT_FACEBOOK_APP_ACCESS_TOKEN!,
  friendsSyncPeriod: Number(process.env.PT_FRIENDS_SYNC_PERIOD!),
  isDevEnv: process.env.NODE_ENV === "development",
  port: Number(process.env.PT_PORT!),
  secret: process.env.PT_SECRET!,
  staticServerUrl: process.env.PT_STATIC_SERVER_URL!,
  trackablesEvaluationPeriod: Number(
    process.env.PT_TRACKABLES_EVALUATION_PERIOD!
  )
};

function makeEnvConfig() {
  return config;
}

export { IEnvConfig, makeEnvConfig };
