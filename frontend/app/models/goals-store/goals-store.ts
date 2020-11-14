import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { GoalModel } from "../goal/goal";
import { StGoal } from "../st-goal/st-goal";
import { withEnvironment } from "../extensions/with-environment";
/**
 * Model description here for TypeScript hints.
 */
export const GoalsStoreModel = types
  .model("GoalsStore")
  .props({
    goals: types.optional(types.array(GoalModel), []),
    STsuggestion: ""
  })
  .extend(withEnvironment)
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    setLTgoals: (LTgoalsList) => {
      if (LTgoalsList) {
        __DEV__ && console.log("Setting LTgoals list " + LTgoalsList.toString());
        self.goals = LTgoalsList;
      } else { __DEV__ && console.log("Unsetting LTgoals list"); }
    },
    setSuggestion: (suggestion) => {
      if (suggestion) {
        __DEV__ && console.log("Setting suggestion list " + suggestion);
        self.STsuggestion = suggestion;
      } else { __DEV__ && console.log("Unsetting suggestion"); self.STsuggestion = ""; }
    }
  })).actions(self => ({
    getAllGoals: () => {
      return self.environment.api.getAllGoals().then(res => {
        if (res.kind === "ok") {
          self.setLTgoals(res.LTgoals);
          __DEV__ && console.log("Got list of LT goals");
        } else {
          __DEV__ && console.log(res.kind);
        }
      }).catch(err => {
        __DEV__ && console.error(err);
      });
    },
    postLTgoal: (LTgoal: string, description: string, STgoals: Array<StGoal>) => {
      return self.environment.api.postLTgoal(LTgoal, description, STgoals).then(res => {
        if (res.kind === "ok") {
          __DEV__ && console.log("Added goal to database");
        } else {
          __DEV__ && console.log(res.kind);
        }
      }).catch(err => {
        __DEV__ && console.error(err);
      });
    },
    putLTgoal: (LTgoal: string, goalID: string, description: string, STgoals: Array<StGoal>) => {
      return self.environment.api.putLTgoal(LTgoal, description, STgoals, goalID).then(res => {
        if (res.kind === "ok") {
          __DEV__ && console.log("Edited goal in database");
        } else {
          __DEV__ && console.log(res.kind);
        }
      }).catch(err => {
        __DEV__ && console.error(err);
      });
    },
    deleteLTgoal: (goalID: string) => {
      return self.environment.api.deleteLTgoal(goalID).then(res => {
        if (res.kind === "ok") {
          __DEV__ && console.log("Deleted goal from database");
        } else {
          __DEV__ && console.log(res.kind);
        }
      }).catch(err => {
        __DEV__ && console.error(err);
      });
    },
    getSTsuggestion: (title: string) => {
      return self.environment.api.getSTsuggestion(title).then(res => {
        if (res.kind === "ok") {
          // self.STsuggestion = res.suggestion;
          self.setSuggestion(res.suggestion);
          __DEV__ && console.log("Got ST goal suggestion");
        } else {
          __DEV__ && console.log(res.kind);
        }
      }).catch(err => {
        __DEV__ && console.error(err);
      });
    },

    // getOneLTgoal: (goal_id: string) => {
    //   // self.environment.api.getOneLTgoal(goal_id).then(res => {
    //   //   if (res.kind == "ok"){
    //   //     // how to display?
    //   //     __DEV__ && console.log("Got one LT goal")
    //   //   } else {
    //   //     __DEV__ && console.log(res.kind);
    //   //   }
    //   // }).catch(err => {
    //   //   __DEV__ && console.error(err);
    //   // })
    //   return self.goals.filter(goal => {
    //     return goal.id == goal_id
    //   })[0]
    // }
  })); // eslint-disable-line @typescript-eslint/no-unused-vars

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type GoalsStoreType = Instance<typeof GoalsStoreModel>
export interface GoalsStore extends GoalsStoreType {}
type GoalsStoreSnapshotType = SnapshotOut<typeof GoalsStoreModel>
export interface GoalsStoreSnapshot extends GoalsStoreSnapshotType {}
