import Knex from "knex";
import { IAsset } from "models/asset";
import path from "path";
import sharp from "sharp";
import { validateClientId } from "utils/common-validators";
import { throwIfNotEmpty } from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import { IEnvConfig } from "utils/env-config";
import ID from "utils/id";
import UUID from "utils/uuid";
import { IValidationErrors, setError } from "utils/validation-result";
import uuid from "uuid/v4";

type IUploadAssetCmd = (
  input: IUploadAssetCmdInput,
  transaction: Knex.Transaction
) => Promise<IAsset>;

interface IUploadAssetCmdInput {
  filePath: string;
  userId: ID;
  clientId?: UUID;
}

function makeUploadAssetCmd(db: Knex, envConfig: IEnvConfig): IUploadAssetCmd {
  return async (input, transaction) => {
    validateInput(input);
    const destFileName = uuid() + ".jpeg";
    const destFilePath = envConfig.assetsDirPath + path.sep + destFileName;
    await addImg(input.filePath, destFilePath);
    const rows = await db(DbTable.Assets)
      .transacting(transaction)
      .insert(
        {
          clientId: input.clientId,
          urlMedium: `${envConfig.staticServerUrl}/${destFileName}`,
          userId: input.userId
        } as IAsset,
        "*"
      );
    return rows[0];
  };
}

function validateInput(input: IUploadAssetCmdInput) {
  const errors: IValidationErrors = {};
  setError(
    errors,
    "filePath",
    input.filePath ? undefined : "Should not be empty"
  );
  setError(
    errors,
    "clientId",
    validateClientId(input.clientId, { isOptional: true })
  );
  throwIfNotEmpty(errors);
}

function addImg(srcFilePath: string, destFilePath: string) {
  return sharp(srcFilePath)
    .resize(480, 480)
    .max()
    .jpeg()
    .toFile(destFilePath);
}

export { makeUploadAssetCmd, IUploadAssetCmd };
