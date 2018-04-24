import Log from "utils/log";

type ITryRun = (action: () => Promise<void>) => Promise<boolean>;

function makeTryRun(log: Log) {
  let consecutiveErrorCount = 0;
  const tryRun: ITryRun = async action => {
    try {
      await action();
      consecutiveErrorCount = 0;
    } catch (e) {
      log.error("tryRun", e);
      ++consecutiveErrorCount;

      if (consecutiveErrorCount >= 8) {
        log.error("tryRun", "Too many consecutive errors");
        return false;
      }
    }

    return true;
  };
  return tryRun;
}

export { makeTryRun };
