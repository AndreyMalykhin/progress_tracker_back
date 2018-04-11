import ID from "utils/id";
import UUID from "utils/uuid";

interface IGymExerciseEntry {
  id: ID;
  userId: ID;
  clientId?: UUID;
  gymExerciseId: ID;
  date: Date;
  setCount: number;
  repetitionCount: number;
  weight: number;
}

export { IGymExerciseEntry };
