import Knex from "knex";
import Difficulty from "models/difficulty";
import ProgressDisplayMode from "models/progress-display-mode";
import { IReview } from "models/review";
import { ITask } from "models/task";
import { ITaskGoal } from "models/task-goal";
import { ITrackable, TrackableType } from "models/trackable";
import { TrackableStatus } from "models/trackable-status";
import ActivityService from "services/activity-service";
import ConstraintViolationError from "utils/constraint-violation-error";
import ID from "utils/id";
import {
  hasErrors,
  isEmpty,
  IValidationErrors,
  setError
} from "utils/validation-result";
import {
  validateLength,
  validateList,
  validatePresense,
  validateRange,
  validateUUID
} from "utils/validators";

interface IAddTaskGoalInput {
  clientId?: ID;
  deadlineDate?: number;
  difficulty: Difficulty;
  iconId: ID;
  isPublic: boolean;
  progressDisplayModeId: ProgressDisplayMode;
  tasks: Array<{
    clientId?: ID;
    title: string;
  }>;
  title: string;
  userId: ID;
}

class TrackableService {
  private db: Knex;
  private activityService: ActivityService;

  public constructor(db: Knex, activityService: ActivityService) {
    this.db = db;
    this.activityService = activityService;
  }

  public async getActive(
    ownerId: ID,
    afterOrder?: number,
    viewerId?: ID,
    limit = 8
  ): Promise<ITrackable[]> {
    const query = this.db("trackables")
      .whereIn("statusId", [
        TrackableStatus.Active,
        TrackableStatus.PendingProof
      ])
      .andWhere("userId", ownerId)
      .orderBy("order", "desc")
      .limit(limit);

    if (afterOrder) {
      query.andWhere("order", "<", afterOrder);
    }

    if (!viewerId || viewerId !== ownerId) {
      query.andWhere("isPublic", true);
    }

    return await query;
  }

  public async getByIds(ids: ID[]): Promise<ITrackable[]> {
    return await this.db("trackables").whereIn("id", ids);
  }

  public async getReview(
    trackableId: ID,
    userId: ID
  ): Promise<IReview | undefined> {
    return await this.db("reviews")
      .where({ userId, trackableId })
      .first();
  }

  public async getTrackableTasks(id: ID): Promise<ITask[]> {
    return await this.db("tasks")
      .where("goalId", id)
      .orderBy("isDone", "asc");
  }

  public async addTaskGoal(
    input: IAddTaskGoalInput,
    transaction: Knex.Transaction
  ): Promise<ITaskGoal> {
    this.preAddTaskGoal(input);
    const {
      clientId,
      deadlineDate,
      difficulty,
      userId,
      progressDisplayModeId,
      iconId,
      isPublic,
      title
    } = input;
    const inputGoal: Partial<ITaskGoal> = {
      clientId,
      deadlineDate: deadlineDate ? new Date(deadlineDate) : undefined,
      difficulty,
      iconId,
      isPublic,
      maxProgress: input.tasks.length,
      order: Date.now(),
      progress: 0,
      progressDisplayModeId,
      statusId: TrackableStatus.Active,
      title,
      typeId: TrackableType.TaskGoal,
      userId
    };
    const rows = await this.db("trackables")
      .transacting(transaction)
      .insert(inputGoal, "*");
    const outputGoal: ITaskGoal = rows[0];
    const tasks = input.tasks.map(task => {
      return {
        clientId: task.clientId,
        goalId: outputGoal.id,
        isDone: false,
        title: task.title
      };
    });
    await this.db("tasks")
      .transacting(transaction)
      .insert(tasks);
    await this.activityService.addTrackableAddedActivity(
      { trackableId: outputGoal.id, userId },
      transaction
    );
    return outputGoal;
  }

  private preAddTaskGoal(input: IAddTaskGoalInput) {
    const {
      clientId,
      difficulty,
      userId,
      progressDisplayModeId,
      iconId,
      isPublic,
      title,
      tasks
    } = input;
    const errors: IValidationErrors = {};
    setError(errors, "clientId", validateUUID(clientId, { isOptional: true }));
    setError(
      errors,
      "difficulty",
      validateRange(difficulty, {
        max: Difficulty.Impossible,
        min: Difficulty.Easy
      })
    );
    setError(errors, "userId", validatePresense(userId));
    setError(
      errors,
      "progressDisplayModeId",
      validatePresense(progressDisplayModeId)
    );
    setError(errors, "iconId", validatePresense(iconId));
    setError(errors, "title", validateLength(title, { max: 255 }));
    const tasksError = validateList(tasks, {
      validateItem: task => {
        const taskErrors: IValidationErrors = {};
        setError(
          taskErrors,
          "clientId",
          validateUUID(task.clientId, { isOptional: true })
        );
        setError(taskErrors, "title", validateLength(task.title, { max: 255 }));
        return taskErrors;
      }
    });
    setError(errors, "tasks", tasksError);
    const validationResult = { errors };

    if (!isEmpty(errors)) {
      throw new ConstraintViolationError("Invalid trackable", { errors });
    }
  }
}

export default TrackableService;
