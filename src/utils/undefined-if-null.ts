function undefinedIfNull<T>(value: T) {
  return value == null ? undefined : value;
}

export default undefinedIfNull;
