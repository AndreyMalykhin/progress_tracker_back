type IEnvConfig = typeof config;

const config = {
  env: process.env.NODE_ENV!,
  facebookAppAccessToken: process.env.PT_FACEBOOK_APP_ACCESS_TOKEN!,
  isDevEnv: process.env.NODE_ENV === "development",
  port: Number(process.env.PT_PORT),
  secret: process.env.PT_SECRET!
};

function makeEnvConfig() {
  return config;
}

export { IEnvConfig, makeEnvConfig };
