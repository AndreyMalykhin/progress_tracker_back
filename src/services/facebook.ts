import { stringify } from "querystring";
import { IEnvConfig } from "utils/env-config";
import { IFetcher } from "utils/fetcher";
import ID from "utils/id";

interface IError {
  message: string;
  type: string;
  code: number;
  error_subcode: number;
  error_user_title: string;
  error_user_msg: string;
  fbtrace_id: string;
}

interface IPaging {
  next?: string;
}

interface IFacebookErrorResponse {
  error: IError;
}

interface IGetFriendsResponse {
  data: IFacebookUser[];
  paging: IPaging;
}

interface IFacebookPicture {
  width: number;
  height: number;
  is_silhouette: boolean;
  url: string;
}

interface IFacebookUser {
  id: string;
  name: string;
  email: string;
}

interface IFacebookTokenInfo {
  expires_at: number;
}

const apiUrl = "https://graph.facebook.com/v2.12/";

class Facebook {
  private fetcher: IFetcher;
  private envConfig: IEnvConfig;

  public constructor(fetcher: IFetcher, envConfig: IEnvConfig) {
    this.fetcher = fetcher;
    this.envConfig = envConfig;
  }

  public async getUser(token: string): Promise<IFacebookUser> {
    const response = await this.fetch("me", token, { fields: "name,email" });

    if (response.error) {
      throw new FacebookError(response);
    }

    return response;
  }

  public async getTokenInfo(token: string): Promise<IFacebookTokenInfo> {
    const response = await this.fetch(
      "debug_token",
      this.envConfig.facebookAppAccessToken,
      { input_token: token }
    );
    const { data } = response;

    if (data.error) {
      throw new FacebookError(data);
    }

    return data;
  }

  public async getFriends(
    token: string,
    nextPageUrl?: string
  ): Promise<IGetFriendsResponse> {
    if (nextPageUrl) {
      const json = await this.fetcher(nextPageUrl).then(res => res.json());

      if (json.error) {
        throw new FacebookError(json);
      }

      return json;
    }

    const response = await this.fetch("me/friends", token);

    if (response.error) {
      throw new FacebookError(response);
    }

    return response;
  }

  public async getUserPicture(
    token: string,
    size: number
  ): Promise<IFacebookPicture> {
    const response = await this.fetch("me/picture", token, {
      height: size,
      redirect: 0
    });

    if (response.error) {
      throw new FacebookError(response);
    }

    return response.data;
  }

  private fetch(endpoint: string, token: string, params?: object) {
    const newParams = { ...params, access_token: token };
    return this.fetcher(`${apiUrl}${endpoint}?${stringify(newParams)}`).then(
      response => response.json()
    );
  }
}

// tslint:disable-next-line:max-classes-per-file
class FacebookError extends Error {
  public response: IFacebookErrorResponse;

  public constructor(response: IFacebookErrorResponse) {
    super(response.error.message);
    this.response = response;
  }
}

function isAuthError(e: FacebookError) {
  return e.response.error.code === 190;
}

function isPermissionError(e: FacebookError) {
  const { code } = e.response.error;
  return code >= 200 && code <= 299;
}

export {
  isAuthError,
  isPermissionError,
  FacebookError,
  IFacebookErrorResponse,
  IFacebookUser,
  IFacebookTokenInfo
};
export default Facebook;
