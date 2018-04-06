import Difficulty from "models/difficulty";
import ProgressDisplayMode from "models/progress-display-mode";
import ID from "utils/id";

interface IGoal {
  difficulty: Difficulty;
  estimatedDifficulty?: number;
  proofPhotoId?: ID;
  rating?: number;
  approveCount?: number;
  rejectCount?: number;
  progressDisplayModeId: ProgressDisplayMode;
  progress: number;
  maxProgress: number;
  deadlineDate?: Date;
  achievementDate?: Date;
}

export { IGoal };
