type IEnvConfig = typeof config;

const config = {
  env: process.env.NODE_ENV,
  isDevEnv: process.env.NODE_ENV === "development",
  port: Number(process.env.PT_PORT)
};

function makeEnvConfig() {
  return config;
}

export { IEnvConfig, makeEnvConfig };
