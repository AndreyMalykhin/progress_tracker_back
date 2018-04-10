import ID from "utils/id";
import {
  isEmpty,
  IValidationError,
  IValidationErrors
} from "utils/validation-result";
import { isLength, isUUID } from "validator";

interface IValidateConfig {
  isOptional?: boolean;
}

interface IValidateRangeConfig extends IValidateConfig {
  min: number;
  max: number;
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

function validateUUID(value: string | undefined, config?: IValidateConfig) {
  return validate(
    value,
    newValue => {
      return !isUUID(newValue) ? "Invalid UUID" : undefined;
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
      const { min, max } = newConfig;
      return newValue < min || newValue > max
        ? `Should be between ${min} and ${max}`
        : undefined;
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
        ? `Should be between ${min} and ${max} symbols`
        : undefined;
    },
    config
  );
}

function validateReference(
  value: ID | number | undefined,
  config?: IValidateConfig
) {
  return validate(
    value,
    newValue => (!newValue ? "Not found" : undefined),
    config
  );
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
  validateUUID,
  validateRange,
  validateReference,
  validateLength,
  validateList,
  validateEnum
};