import {
  IAddTrackableCmd,
  IAddTrackableCmdInput,
  makeAddTrackableCmd
} from "commands/add-trackable-cmd";
import { validateIcon } from "commands/trackable-cmd-helpers";
import Knex from "knex";
import { ICounter } from "models/counter";
import { TrackableType } from "models/trackable";
import { TrackableStatus } from "models/trackable-status";
import ID from "utils/id";
import { IValidationErrors } from "utils/validation-result";

type IAddCounterCmd = IAddTrackableCmd<ICounter, IAddCounterCmdInput>;

interface IAddCounterCmdInput extends IAddTrackableCmdInput {
  iconId: ID;
  isPublic: boolean;
}

function makeAddCounterCmd(db: Knex): IAddCounterCmd {
  return makeAddTrackableCmd(db, validateInput, inputToTrackable);
}

function inputToTrackable(input: IAddCounterCmdInput): Partial<ICounter> {
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

function validateInput(input: IAddCounterCmdInput, errors: IValidationErrors) {
  validateIcon(input.iconId, errors);
}

export { makeAddCounterCmd, IAddCounterCmdInput, IAddCounterCmd };
