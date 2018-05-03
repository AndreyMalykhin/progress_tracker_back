import Log from "utils/log";
import wait from "utils/wait";

type ITryRun = (action: () => Promise<any>) => Promise<boolean>;

function makeTryRun(log: Log, attemptCount = 8) {
  let consecutiveErrorCount = 0;
  const maxConsecutiveErrorCount = Math.max(8, attemptCount);
  const tryRun: ITryRun = async action => {
    let waitDuration = 1024;
    let attemptsLeft = attemptCount;

    while (attemptsLeft > 0) {
      --attemptsLeft;

      try {
        await action();
        consecutiveErrorCount = 0;
        return true;
      } catch (e) {
        log.error("tryRun", e);
        ++consecutiveErrorCount;

        if (consecutiveErrorCount >= maxConsecutiveErrorCount) {
          log.error("tryRun", "Too many consecutive errors");
          return false;
        }

        if (attemptsLeft) {
          waitDuration *= 2;
          await wait(waitDuration);
        }
      }
    }

    if (attemptCount === 1) {
      return true;
    }

    log.error("tryRun", "Retry timeout");
    return false;
  };
  return tryRun;
}

export { makeTryRun };
