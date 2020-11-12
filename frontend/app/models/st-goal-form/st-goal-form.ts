import { parse } from "@babel/core";
import { Instance, SnapshotOut, types } from "mobx-state-tree";

/**
 * Model description here for TypeScript hints.
 */
export const StGoalFormModel = types
  .model("StGoalForm")
  .props({
    title: "",
    day: "mon",
    hour: "00",
    minute: "00"
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    setTitle(title: string) {
      self.title = title;
      console.log(self.title);
    },
    setDay(day: string) {
      self.day = day;
    },
    // validateHour(hour: string){
    //   self.hour = hour.replace(/[^0-9]/g, '');
    //   if (parseInt(self.hour) > 23) {
    //     self.hour = (23).toString()
    //   }
    //   console.log(self.hour)
    // },
    // validateMin(minute: string){
    //   self.minute = minute.replace(/[^0-9]/g, '');
    //   if (parseInt(self.minute) > 59) {
    //     self.hour = (59).toString()
    //   }
    // },
    setHour(hour: string) {
      self.hour = hour;
    },
    setMin(minute: string) {
      self.minute = minute;
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
