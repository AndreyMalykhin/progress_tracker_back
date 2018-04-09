import { IAggregatable } from "models/aggregatable";
import { IPrimitiveTrackable } from "models/primitive-trackable";
import { ITrackable } from "models/trackable";

interface ICounter extends ITrackable, IPrimitiveTrackable, IAggregatable {
  progress: number;
}

export { ICounter };
