import Raven from "raven";
import { IEnvConfig } from "utils/env-config";

function registerErrorReporter(envConfig: IEnvConfig) {
  if (!envConfig.sentryDsn) {
    return;
  }

  Raven.config(envConfig.sentryDsn, {
    release: envConfig.version
  }).install();
}

export { registerErrorReporter };
