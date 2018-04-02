import fetch, { Request, RequestInit } from "node-fetch";

type IFetcher = typeof fetch;

function makeFetcher() {
  return (input: string | Request, init?: RequestInit) => {
    return fetch(input, init);
  };
}

export { makeFetcher, IFetcher };
