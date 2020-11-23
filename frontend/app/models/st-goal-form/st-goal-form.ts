import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { getDay } from "../../utils/getDay";

/**
 * Model description here for TypeScript hints.
 */
export const StGoalFormModel = types
  .model("StGoalForm")
  .props({
    title: "",
    day: getDay(true),
    hour: "",
    minute: "",
    id: "",
    meridies: "am"
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    setTitle(title: string) {
      self.title = title;
    },
    setDay(day: string) {
      self.day = day;
    },
    setHour(hour: string) {
      self.hour = hour;
    },
    setMin(minute: string) {
      self.minute = minute;
    },
    setID(id: string) {
      self.id = id;
    },
    setMeridiem(val: string) {
      self.meridies = val;
    }
  })); // eslint-disable-line @typescript-eslint/no-unused-vars

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type StGoalFormType = Instance<typeof StGoalFormModel>
export interface StGoalForm extends StGoalFormType {}
type StGoalFormSnapshotType = SnapshotOut<typeof StGoalFormModel>
export interface StGoalFormSnapshot extends StGoalFormSnapshotType {}
