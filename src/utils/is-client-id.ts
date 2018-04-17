import ID from "utils/id";
import { isUUID } from "validator";

function isClientId(id: string | undefined) {
  return id && isUUID(id);
}

export default isClientId;
