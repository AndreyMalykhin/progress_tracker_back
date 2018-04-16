import ID from "utils/id";

function isIdEqual(lhs: ID | undefined, rhs: ID | undefined) {
  // tslint:disable-next-line:triple-equals
  return lhs == rhs;
}

export default isIdEqual;
