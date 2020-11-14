import { AwardStoreModel } from "../award-store/award-store"
import { DailyGoalStoreModel } from "../daily-goal-store/daily-goal-store";
import { GoalsStoreModel } from "../goals-store/goals-store";
import { UserStoreModel } from "../user-store/user-store";
import { LtGoalFormModel } from "../lt-goal-form/lt-goal-form";
import { Instance, SnapshotOut, types } from "mobx-state-tree";

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  awardStore: types.optional(AwardStoreModel, {}),
  dailyGoalStore: types.optional(DailyGoalStoreModel, {}),
  goalsStore: types.optional(GoalsStoreModel, {}),
  userStore: types.optional(UserStoreModel, {}),
  LtGoalFormStore: types.optional(LtGoalFormModel, {}),

});

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
