import http from "http";
import { makeApp } from "utils/app";
import { makeDIContainer } from "utils/di-container";
import { registerErrorReporter } from "utils/error-reporter";
import { makeLog } from "utils/log";

const log = makeLog("bootstrap");

function bootstrap() {
  const diContainer = makeDIContainer();
  registerErrorReporter(diContainer.envConfig);
  const port = diContainer.envConfig.port;
  const server = http.createServer(makeApp(diContainer));
  server.listen(port);

  server.on("error", (error: any) => {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    switch (error.code) {
      case "EACCES":
        log.error("bootstrap", bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        log.error("bootstrap", bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  server.on("listening", () => {
    const addr = server.address();
    const bind =
      typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    log.trace("bootstrap", "Listening on " + bind);
  });
}

export default bootstrap;
