import { ICounter } from "models/counter";
import { INumericalGoal } from "models/numerical-goal";
import { ITaskGoal } from "models/task-goal";
import { ITrackable } from "models/trackable";

interface IAggregate extends ITrackable {
  progress: number;
  maxProgress?: number;
}

type IAggregateChildren = Array<ITaskGoal | INumericalGoal> | ICounter[];

export { IAggregate, IAggregateChildren };
