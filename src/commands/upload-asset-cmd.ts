import Knex from "knex";
import { assetSizes, IAsset } from "models/asset";
import path from "path";
import { validateClientId } from "utils/common-validators";
import { throwIfNotEmpty } from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import { IEnvConfig } from "utils/env-config";
import ID from "utils/id";
import { IImgProcessor } from "utils/img-processor";
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

function makeUploadAssetCmd(
  db: Knex,
  envConfig: IEnvConfig,
  imgProcessor: IImgProcessor
): IUploadAssetCmd {
  return async (input, transaction) => {
    validateInput(input);
    const imgUrl = await addImg(input.filePath, envConfig, imgProcessor);
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
  envConfig: IEnvConfig,
  imgProcessor: IImgProcessor
) {
  const destFileName = uuid() + ".jpeg";
  await imgProcessor(srcFilePath)
    .resize(assetSizes.medium, assetSizes.medium)
    .max()
    .jpeg()
    .toFile(envConfig.assetsDirPath + path.sep + destFileName);
  return `${envConfig.staticServerUrl}/${
    envConfig.assetsDirName
  }/${destFileName}`;
}

export { makeUploadAssetCmd, IUploadAssetCmd };
