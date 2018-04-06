import jwt from "jsonwebtoken";
import { IEnvConfig } from "utils/env-config";
import ID from "utils/id";
import { ISession } from "utils/session";

class AccessTokenService {
  private envConfig: IEnvConfig;

  public constructor(envConfig: IEnvConfig) {
    this.envConfig = envConfig;
  }

  public sign(expirationDate: number, userId: ID) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          exp: expirationDate,
          userId
        } as ISession,
        this.envConfig.secret,
        {},
        (error, token) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(token);
        }
      );
    });
  }

  public verify(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.envConfig.secret, undefined, (error, payload) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(payload as ISession);
      });
    });
  }
}

export default AccessTokenService;
