import ID from "utils/id";

interface IGymExerciseEntry {
  id: ID;
  clientId?: ID;
  gymExerciseId: ID;
  date: Date;
  setCount: number;
  repetitionCount: number;
  weight: number;
}

export { IGymExerciseEntry };
