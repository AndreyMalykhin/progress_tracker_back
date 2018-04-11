import UUID from "utils/uuid";
import { isUUID } from "validator";

function safeUUID(value: UUID) {
  return isUUID(value) ? value : "00000000-0000-0000-0000-000000000000";
}

export default safeUUID;
