import ID from "utils/id";
import { isUUID } from "validator";

function isClientId(id: ID) {
  return isUUID(id);
}

export default isClientId;
