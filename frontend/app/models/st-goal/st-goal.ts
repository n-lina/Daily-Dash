import { Instance, SnapshotOut, types } from "mobx-state-tree";

/**
 * Model description here for TypeScript hints.
 */
export const StGoalModel = types
  .model("StGoal")
  .props({
    id: "",
    title: types.string,
    mon: types.optional(types.array(types.integer), []),
    tue: types.optional(types.array(types.integer), []),
    wed: types.optional(types.array(types.integer), []),
    thu: types.optional(types.array(types.integer), []),
    fri: types.optional(types.array(types.integer), []),
    sat: types.optional(types.array(types.integer), []),
    sun: types.optional(types.array(types.integer), [])
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({})); // eslint-disable-line @typescript-eslint/no-unused-vars

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type StGoalType = Instance<typeof StGoalModel>
export interface StGoal extends StGoalType {}
type StGoalSnapshotType = SnapshotOut<typeof StGoalModel>
export interface StGoalSnapshot extends StGoalSnapshotType {}
