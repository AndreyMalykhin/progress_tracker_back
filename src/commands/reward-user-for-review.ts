import Knex from "knex";
import { bonusRatingForReview, IUser } from "models/user";
import DbTable from "utils/db-table";
import ID from "utils/id";

async function rewardUserForReview(
  user: IUser,
  db: Knex,
  transaction: Knex.Transaction
) {
  let bonusRating = 0;

  if (user!.rewardableReviewsLeft) {
    bonusRating = bonusRatingForReview;
    user = await updateUser(user!.id, bonusRating, db, transaction);
  }

  return { user, bonusRating };
}

async function updateUser(
  id: ID,
  bonusRating: number,
  db: Knex,
  transaction: Knex.Transaction
): Promise<IUser> {
  const rows = await db(DbTable.Users)
    .transacting(transaction)
    .update(
      {
        rating: db.raw("?? + ?", ["rating", bonusRating]),
        rewardableReviewsLeft: db.raw("?? - 1", "rewardableReviewsLeft")
      },
      "*"
    )
    .where("id", id);
  return rows[0];
}

export default rewardUserForReview;
