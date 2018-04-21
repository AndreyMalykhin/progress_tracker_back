import ID from "utils/id";

interface IDbCursor<T> {
  value: T;
  id: ID;
}

function strToCursor<T>(
  str: string | undefined,
  makeCursor: (value: string, id: string) => IDbCursor<T>
): IDbCursor<T> | undefined {
  if (!str) {
    return undefined;
  }

  const [value, id] = str.split("_");
  return makeCursor(value, id);
}

function strToDateCursor(str: string | undefined): IDbCursor<Date> | undefined {
  return strToCursor(str, (value, id) => {
    return { value: new Date(Number(value)), id };
  });
}

function strToNumberCursor(
  str: string | undefined
): IDbCursor<number> | undefined {
  return strToCursor(str, (value, id) => {
    return { value: Number(value), id };
  });
}

function cursorToStr<T>(cursor: IDbCursor<T>) {
  const { value } = cursor;
  return `${value instanceof Date ? value.getTime() : value}_${cursor.id}`;
}

export { IDbCursor, cursorToStr, strToDateCursor, strToNumberCursor };
