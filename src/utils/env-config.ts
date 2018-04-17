type IEnvConfig = typeof config;

const config = {
  assetsDirPath: process.env.PT_ASSETS_DIR_PATH!,
  env: process.env.NODE_ENV!,
  facebookAppAccessToken: process.env.PT_FACEBOOK_APP_ACCESS_TOKEN!,
  isDevEnv: process.env.NODE_ENV === "development",
  port: Number(process.env.PT_PORT),
  secret: process.env.PT_SECRET!,
  staticServerUrl: process.env.PT_STATIC_SERVER_URL!
};

function makeEnvConfig() {
  return config;
}

export { IEnvConfig, makeEnvConfig };
