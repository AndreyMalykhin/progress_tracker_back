import Raven from "raven";
import { IEnvConfig } from "utils/env-config";

function registerErrorReporter(envConfig: IEnvConfig) {
  Raven.config(envConfig.sentryDsn || false, {
    release: envConfig.version
  }).install();
}

export { registerErrorReporter };
