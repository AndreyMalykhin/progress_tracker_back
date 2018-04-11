import ID from "utils/id";
import UUID from "utils/uuid";

interface ITask {
  id: ID;
  clientId?: UUID;
  userId: ID;
  goalId: ID;
  creationDate: Date;
  title: string;
  isDone: boolean;
}

export { ITask };
