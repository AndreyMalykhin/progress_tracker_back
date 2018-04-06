import ID from "utils/id";

interface ITask {
  id: ID;
  clientId?: ID;
  goalId: ID;
  creationDate: Date;
  title: string;
  isDone: boolean;
}

export { ITask };
