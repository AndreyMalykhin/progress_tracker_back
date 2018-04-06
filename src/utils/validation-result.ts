interface IValidationResult {
  errors: IValidationErrors;
}

type IValidationError = string | IValidationErrors[];

interface IValidationErrors {
  [field: string]: IValidationError;
}

interface IMapErrorsConfig {
  [oldField: string]: {
    field?: string;
    error?: IValidationError;
  };
}

function setError(
  errors: IValidationErrors,
  field: string,
  error?: IValidationError
) {
  if (error) {
    errors[field] = error;
  } else {
    delete errors[field];
  }
}

function mapErrors(
  validationResult: IValidationResult,
  config: IMapErrorsConfig
) {
  const oldErrors = validationResult.errors;
  const newErrors: IValidationErrors = {};

  // tslint:disable-next-line:forin
  for (const oldField in oldErrors) {
    const fieldMapping = config[oldField];

    if (fieldMapping) {
      const newField = fieldMapping.field || oldField;
      const newError = fieldMapping.error || oldErrors[oldField];
      setError(newErrors, newField, newError);
      continue;
    }

    newErrors[oldField] = oldErrors[oldField];
  }

  validationResult.errors = newErrors;
}

function hasErrors(validationResult: IValidationResult) {
  return !isEmpty(validationResult.errors);
}

function isEmpty(errors: IValidationErrors) {
  return Object.keys(errors).length === 0;
}

export {
  IValidationErrors,
  IValidationError,
  IValidationResult,
  hasErrors,
  mapErrors,
  setError,
  isEmpty
};
