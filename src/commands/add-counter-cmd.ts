import {
  IAddTrackableCmd,
  IAddTrackableCmdInput,
  makeAddTrackableCmd
} from "commands/add-trackable-cmd";
import Knex from "knex";
import { ICounter } from "models/counter";
import { TrackableType } from "models/trackable";
import { TrackableStatus } from "models/trackable-status";
import { validateReference } from "utils/common-validators";
import ID from "utils/id";
import { IValidationErrors, setError } from "utils/validation-result";

type IAddCounterCmd = IAddTrackableCmd<ICounter, IAddCounterCmdInput>;

interface IAddCounterCmdInput extends IAddTrackableCmdInput {
  iconId: ID;
  isPublic: boolean;
}

function makeAddCounterCmd(db: Knex): IAddCounterCmd {
  return makeAddTrackableCmd(db, validateInput, inputToTrackable);
}

async function inputToTrackable(
  input: IAddCounterCmdInput
): Promise<Partial<ICounter>> {
  const { clientId, userId, iconId, isPublic, title } = input;
  return {
    clientId,
    iconId,
    isPublic,
    order: Date.now(),
    progress: 0,
    statusId: TrackableStatus.Active,
    title,
    typeId: TrackableType.Counter,
    userId
  };
}

async function validateInput(
  input: IAddCounterCmdInput,
  errors: IValidationErrors
) {
  setError(errors, "iconId", validateReference(input.iconId));
}

export { makeAddCounterCmd, IAddCounterCmdInput, IAddCounterCmd };
