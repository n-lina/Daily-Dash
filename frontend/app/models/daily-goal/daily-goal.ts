import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const DailyGoalModel = types
  .model("DailyGoal")
  .props({
    title: types.string,
    time: types.number,
    id: types.identifier,
    cancelled: false,
    completed: false
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    setCancelled(cancelled: boolean) {
      self.cancelled = cancelled;
    },
    setCompleted(completed: boolean) {
      self.completed = completed;
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type DailyGoalType = Instance<typeof DailyGoalModel>
export interface DailyGoal extends DailyGoalType {}
type DailyGoalSnapshotType = SnapshotOut<typeof DailyGoalModel>
export interface DailyGoalSnapshot extends DailyGoalSnapshotType {}
