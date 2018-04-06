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

interface IValidateListConfig<T> extends IValidateConfig {
  validateItem: (item: T) => IValidationErrors;
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

function validateLength(
  value: string | undefined,
  config: IValidateLengthConfig
) {
  return validate(
    value,
    (newValue, newConfig) => {
      const { max } = newConfig;
      return !isLength(newValue, { min: 1, max })
        ? `Should be shorter than ${max + 1} symbols`
        : undefined;
    },
    config
  );
}

function validatePresense(value: any, config?: IValidateConfig) {
  return validate(value, () => undefined, config);
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

      const allErrors: IValidationErrors[] = [];

      for (const item of newValue) {
        const itemErrors = config.validateItem(item);

        if (!isEmpty(itemErrors)) {
          allErrors.push(itemErrors);
        }
      }

      return allErrors.length ? allErrors : undefined;
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
  validatePresense,
  validateLength,
  validateList
};
