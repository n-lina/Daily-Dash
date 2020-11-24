import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { StGoalFormModel } from "../st-goal-form/st-goal-form";
import { getDay } from "../../utils/getDay";
import { TimeFormModel } from "../time-form/time-form";
import { boolean } from "mobx-state-tree/dist/internal";

/**
 * Model description here for TypeScript hints.
 */
export const LtGoalFormModel = types
  .model("LtGoalForm")
  .props({
    title: "",
    description: "",
    id: "",
    STgoalForm: types.optional(types.array(StGoalFormModel), []),
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    setId(id: string) {
      self.id = id;
    },
    setTitle(title: string) {
      self.title = title;
    },
    setDescription(desc: string) {
      self.description = desc;
    },
    initSTgoals(title: string, day: string = getDay(true), hr = "", min = "", id = "") {
      const myGoal = StGoalFormModel.create();
      if (min.length < 2) min = "0" + min;
      myGoal.setID(id);
      myGoal.setTitle(title);
      myGoal.addThisTimeSlot(day, hr, min);
      self.STgoalForm.push(myGoal);
    },
    addSTgoal() {
      const freshStGoal = StGoalFormModel.create();
      freshStGoal.addTimeSlot();
      self.STgoalForm.push(freshStGoal);
    },
    deleteSTgoal() {
      self.STgoalForm.pop();
    },
    // submitData() {
    //   console.log("-------------------");
    //   console.log("self.title " + self.title);
    //   console.log("self.description " + self.description);
    //   self.STgoalForm.forEach(g => console.log("ST.title " + g.title + " " + g.day + " " + g.hour + " " + g.minute));
    //   console.log("-------------------");
    // },
    clearForm() {
      self.title = "";
      self.description = "";
      self.STgoalForm.length = 0;
    },
  })); // eslint-disable-line @typescript-eslint/no-unused-vars

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type LtGoalFormType = Instance<typeof LtGoalFormModel>
export interface LtGoalForm extends LtGoalFormType {}
type LtGoalFormSnapshotType = SnapshotOut<typeof LtGoalFormModel>
export interface LtGoalFormSnapshot extends LtGoalFormSnapshotType {}
