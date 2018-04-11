import ID from "utils/id";
import nonexistentId from "utils/nonexistent-id";

function safeId(id: ID | number) {
  const int = parseInt(id as string, 10);

  // tslint:disable-next-line:triple-equals
  return isNaN(int) || int != id ? nonexistentId : id;
}

export default safeId;
