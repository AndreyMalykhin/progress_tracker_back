type IEnvConfig = typeof config;

const config = {
  assetsDirName: process.env.PT_ASSETS_DIR_NAME!,
  assetsDirPath: process.env.PT_ASSETS_DIR_PATH!,
  avatarsDirName: process.env.PT_AVATARS_DIR_NAME!,
  avatarsDirPath: process.env.PT_AVATARS_DIR_PATH!,
  env: process.env.NODE_ENV!,
  facebookAppAccessToken: process.env.PT_FACEBOOK_APP_ACCESS_TOKEN!,
  friendsSyncPeriod: Number(process.env.PT_FRIENDS_SYNC_PERIOD!),
  isDevEnv: process.env.NODE_ENV === "development",
  port: Number(process.env.PT_PORT!),
  secret: process.env.PT_SECRET!,
  sentryDsn: process.env.SENTRY_DSN,
  staticServerUrl: process.env.PT_STATIC_SERVER_URL!,
  trackablesEvaluationPeriod: Number(
    process.env.PT_TRACKABLES_EVALUATION_PERIOD!
  ),
  trackablesExpirationPeriod: Number(
    process.env.PT_TRACKABLES_EXPIRATION_PERIOD!
  ),
  version: process.env.PT_VERSION!
};

function makeEnvConfig() {
  return config;
}

export { IEnvConfig, makeEnvConfig };
