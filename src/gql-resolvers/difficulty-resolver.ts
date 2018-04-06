import Difficulty from "models/difficulty";

const difficultyResolver = {
  Easy: Difficulty.Easy,
  Hard: Difficulty.Hard,
  Impossible: Difficulty.Impossible,
  Medium: Difficulty.Medium
};

export default difficultyResolver;
