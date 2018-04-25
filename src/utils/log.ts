import debug from "debug";
import Raven from "raven";

class Log {
  private namespace: string;
  private debugger: debug.IDebugger;

  public constructor(namespace: string) {
    this.namespace = namespace;
    this.debugger = debug("progress-tracker:" + namespace);
  }

  public trace(funcName: string, formatter?: string, ...args: any[]) {
    this.debugger(`${funcName}() ${formatter || ""}`, ...args);
  }

  public error(funcName: string, e: Error | string, info?: object) {
    this.trace(funcName, "error=%o; info=%o", e, info);
    const namespacedFuncName = `${this.namespace}.${funcName}`;
    const options: Raven.CaptureOptions = {
      extra: info,
      fingerprint: ["{{ default }}", namespacedFuncName],
      tags: { func: namespacedFuncName }
    };

    if (typeof e === "string") {
      Raven.captureMessage(e, options);
      return;
    }

    Raven.captureException(e, options);
  }
}

function makeLog(namespace: string) {
  return new Log(namespace);
}

export { makeLog };
export default Log;
