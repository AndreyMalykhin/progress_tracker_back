import { IValidationResult } from "utils/validation-result";

class ConstraintViolationError extends Error {
  public validationResult: IValidationResult;

  public constructor(msg: string, validationResult: IValidationResult) {
    super(msg);
    this.validationResult = validationResult;
  }
}

export default ConstraintViolationError;
