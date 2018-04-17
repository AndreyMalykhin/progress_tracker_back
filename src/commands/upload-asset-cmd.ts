import Knex from "knex";
import { assetSizes, IAsset } from "models/asset";
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
    const imgUrl = await addImg(
      input.filePath,
      envConfig.assetsDirPath,
      envConfig.staticServerUrl
    );
    const rows = await db(DbTable.Assets)
      .transacting(transaction)
      .insert(
        {
          clientId: input.clientId,
          urlMedium: imgUrl,
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

async function addImg(
  srcFilePath: string,
  assetsDirPath: string,
  staticServerUrl: string
) {
  const destFileName = uuid() + ".jpeg";
  await sharp(srcFilePath)
    .resize(assetSizes.medium, assetSizes.medium)
    .max()
    .jpeg()
    .toFile(assetsDirPath + path.sep + destFileName);
  return `${staticServerUrl}/${destFileName}`;
}

export { makeUploadAssetCmd, IUploadAssetCmd };
