import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { DailyGoalModel } from "../daily-goal/daily-goal"

/**
 * Model description here for TypeScript hints.
 */
export const DailyGoalStoreModel = types
  .model("DailyGoalStore")
  .props({
    goals: types.optional(types.array(DailyGoalModel), [])
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    addGoal(goal) {
      self.goals.push({
        id: (new Date()).getMilliseconds().toString(),
        title: "Hello world",
        time: (new Date()).getSeconds()/60
      })
    },

    clearGoals() {
      self.goals.replace([]);
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type DailyGoalStoreType = Instance<typeof DailyGoalStoreModel>
export interface DailyGoalStore extends DailyGoalStoreType {}
type DailyGoalStoreSnapshotType = SnapshotOut<typeof DailyGoalStoreModel>
export interface DailyGoalStoreSnapshot extends DailyGoalStoreSnapshotType {}
