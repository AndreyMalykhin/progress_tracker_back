import ID from "utils/id";
import isClientId from "utils/is-client-id";
import nonexistentId from "utils/nonexistent-id";
import safeId from "utils/safe-id";
import {
  isEmpty,
  IValidationError,
  IValidationErrors
} from "utils/validation-result";
import { isLength } from "validator";

interface IValidateConfig {
  isOptional?: boolean;
}

interface IValidateRangeConfig extends IValidateConfig {
  min: number;
  max: number;
  isInteger?: boolean;
}

interface IValidateLengthConfig extends IValidateConfig {
  max: number;
}

interface IValidateEnumConfig<T> extends IValidateConfig {
  values: T[];
}

interface IValidateListConfig<T> extends IValidateConfig {
  validateItem: (item: T, index: number) => IValidationErrors;
}

const baseDefaultConfig: IValidateConfig = { isOptional: false };

function validateClientId(value: string | undefined, config?: IValidateConfig) {
  return validate(
    value,
    newValue => {
      return !isClientId(newValue) ? "Invalid UUID" : undefined;
    },
    config
  );
}

function validateRange(
  value: number | undefined,
  config: IValidateRangeConfig
) {
  return validate(
    value,
    (newValue, newConfig) => {
      const { min, max, isInteger } = newConfig;

      if (isInteger) {
        const error = validateInt(newValue);

        if (error) {
          return error;
        }
      }

      return newValue < min || newValue > max
        ? `Should be between ${min} and ${max}`
        : undefined;
    },
    config
  );
}

function validateInt(value: number | undefined, config?: IValidateConfig) {
  return validate(
    value,
    (newValue, newConfig) => {
      return !Number.isInteger(newValue) ? "Should be an integer" : undefined;
    },
    config
  );
}

function validateEnum<T>(value: T | undefined, config: IValidateEnumConfig<T>) {
  return validate(
    value,
    (newValue, newConfig) => {
      const { values } = newConfig;
      return values.indexOf(newValue) === -1 ? `Invalid value` : undefined;
    },
    config
  );
}

function validateLength(
  value: string | undefined,
  config: IValidateLengthConfig
) {
  return validate(
    value,
    (newValue, newConfig) => {
      const { max } = newConfig;
      const min = 1;
      return !isLength(newValue, { min, max })
        ? `Length should be between ${min} and ${max}`
        : undefined;
    },
    config
  );
}

function validateId(
  value: string | number | undefined,
  config?: IValidateConfig
) {
  const msg = "Not found";
  const error = validate(
    value,
    newValue => {
      if (!newValue) {
        return msg;
      }

      return safeId(newValue) === nonexistentId ? msg : undefined;
    },
    config
  );
  return error ? msg : undefined;
}

function validateList<T>(
  value: T[] | undefined,
  config: IValidateListConfig<T>
) {
  return validate(
    value,
    (newValue, newConfig) => {
      if (newValue.length === 0) {
        return newConfig.isOptional ? undefined : "Should not be empty";
      }

      const allErrors: IValidationErrors = {};
      let hasErrors = false;

      for (let i = 0; i < newValue.length; ++i) {
        const itemErrors = config.validateItem(newValue[i], i);

        if (!isEmpty(itemErrors)) {
          allErrors[i] = itemErrors;
          hasErrors = true;
        }
      }

      return hasErrors ? allErrors : undefined;
    },
    config
  );
}

function validate<TValue, TConfig extends IValidateConfig>(
  value: TValue | undefined,
  doValidate: (value: TValue, config: TConfig) => IValidationError | undefined,
  config?: TConfig
) {
  const newConfig = Object.assign({}, baseDefaultConfig, config);

  if (value == null) {
    return newConfig.isOptional ? undefined : "Should not be empty";
  }

  return doValidate(value, newConfig);
}

export {
  validateClientId,
  validateRange,
  validateId,
  validateLength,
  validateList,
  validateEnum,
  validateInt
};
