import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { TimeFormModel } from "../time-form/time-form";
import { getDay } from "../../utils/getDay";

/**
 * Model description here for TypeScript hints.
 */
export const StGoalFormModel = types
  .model("StGoalForm")
  .props({
    id: "",
    title: "",
    timeForm: types.optional(types.array(TimeFormModel), []),
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    setTitle(title: string) {
      self.title = title;
    },
    setID(id: string) {
      self.id = id;
    },
    addTimeSlot() {
      self.timeForm.push(TimeFormModel.create());
      console.log("banana")
    },
    addThisTimeSlot(day: string = getDay(true), hr = "", min = "") {
      const myTimeSlot = TimeFormModel.create();
      myTimeSlot.setDay(day);
      myTimeSlot.setHour(hr);
      myTimeSlot.setMin(min);
      // myTimeSlot.setMeridiem("am");
      self.timeForm.push(myTimeSlot)
    },
    deleteTimeSlot() {
      if (self.timeForm.length > 1) self.timeForm.pop();
      console.log("apple")
    },
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
