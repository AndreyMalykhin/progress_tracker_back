import Knex from "knex";
import { avatarSizes, IAvatar } from "models/avatar";
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

type IUploadAvatarCmd = (
  input: IUploadAvatarCmdInput,
  transaction: Knex.Transaction
) => Promise<IAvatar>;

interface IUploadAvatarCmdInput {
  filePath: string;
  userId: ID;
  clientId?: UUID;
}

function makeUploadAvatarCmd(
  db: Knex,
  envConfig: IEnvConfig
): IUploadAvatarCmd {
  return async (input, transaction) => {
    validateInput(input);
    const imgUrls = await addImages(
      input.filePath,
      envConfig.avatarsDirPath,
      envConfig.staticServerUrl
    );
    const rows = await db(DbTable.Avatars)
      .transacting(transaction)
      .insert(
        {
          clientId: input.clientId,
          urlMedium: imgUrls.medium,
          urlSmall: imgUrls.small,
          userId: input.userId
        } as IAvatar,
        "*"
      );
    return rows[0];
  };
}

function validateInput(input: IUploadAvatarCmdInput) {
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

async function addImages(
  srcFilePath: string,
  assetsDirPath: string,
  staticServerUrl: string
) {
  const pipeline = sharp(srcFilePath)
    .max()
    .jpeg();
  const destFileNameSmall = uuid() + ".jpeg";
  const result1 = pipeline
    .clone()
    .resize(avatarSizes.small, avatarSizes.small)
    .toFile(assetsDirPath + path.sep + destFileNameSmall);
  const destFileNameMedium = uuid() + ".jpeg";
  const result2 = pipeline
    .clone()
    .resize(avatarSizes.medium, avatarSizes.medium)
    .toFile(assetsDirPath + path.sep + destFileNameMedium);
  await Promise.all([result1, result2]);
  return {
    medium: `${staticServerUrl}/${destFileNameMedium}`,
    small: `${staticServerUrl}/${destFileNameSmall}`
  };
}

export { makeUploadAvatarCmd, IUploadAvatarCmd };
