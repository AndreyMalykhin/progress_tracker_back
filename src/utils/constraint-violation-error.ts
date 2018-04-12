import {
  isEmpty,
  IValidationErrors,
  IValidationResult
} from "utils/validation-result";

class ConstraintViolationError extends Error {
  public validationResult: IValidationResult;

  public constructor(msg: string, validationResult: IValidationResult) {
    super(msg);
    this.validationResult = validationResult;
  }
}

function throwIfNotEmpty(errors: IValidationErrors) {
  if (!isEmpty(errors)) {
    throw new ConstraintViolationError("Invalid input", { errors });
  }
}

export { throwIfNotEmpty };
export default ConstraintViolationError;
