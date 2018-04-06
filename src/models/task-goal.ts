import { IAggregatable } from "models/aggregatable";
import { IGoal } from "models/goal";
import { IPrimitiveTrackable } from "models/primitive-trackable";
import { ITrackable } from "models/trackable";

interface ITaskGoal
  extends ITrackable,
    IPrimitiveTrackable,
    IGoal,
    IAggregatable {}

export { ITaskGoal };
