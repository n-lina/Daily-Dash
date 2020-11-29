import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { getDay } from "../../utils/getDay";

/**
 * Model description here for TypeScript hints.
 */
export const TimeFormModel = types
  .model("TimeForm")
  .props({
    day: getDay(true),
    hour: "",
    minute: "",
    meridies: ""
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    setDay(day: string) {
      self.day = day;
    },
    setHour(hour: string) {
      self.hour = hour;
    },
    setMin(minute: string) {
      self.minute = minute;
    },
    setMeridiem(val: string) {
      self.meridies = val;
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type TimeFormType = Instance<typeof TimeFormModel>
export interface TimeForm extends TimeFormType {}
type TimeFormSnapshotType = SnapshotOut<typeof TimeFormModel>
export interface TimeFormSnapshot extends TimeFormSnapshotType {}
