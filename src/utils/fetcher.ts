import fetch, { Request, RequestInit } from "node-fetch";
import { makeLog } from "utils/log";

type IFetcher = typeof fetch;

const log = makeLog("fetcher");

function makeFetcher() {
  const fetcher = (request: string | Request, config?: RequestInit) => {
    log.trace("fetcher", "request=%o; config=%o", request, config);
    return fetch(request, config);
  };
  return fetcher;
}

export { makeFetcher, IFetcher };
