import ID from "utils/id";
import { isUUID } from "validator";

function isClientId(id: string) {
  return isUUID(id);
}

export default isClientId;
