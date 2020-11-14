import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { DailyGoalModel } from "../daily-goal/daily-goal";
import { withEnvironment } from "../extensions/with-environment";

/**
 * Model description here for TypeScript hints.
 */
export const DailyGoalStoreModel = types
  .model("DailyGoalStore")
  .props({
    goals: types.optional(types.array(DailyGoalModel), []),
    day: "",
  })
  .extend(withEnvironment)
  .views((self) => ({
    getRemainingCount(): number {
      return self.goals.filter((g) => !(g.cancelled || g.completed)).length;
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    addGoal(goal) {
      self.goals.push({
        id: goal.id,
        title: goal.title,
        time: goal.time,
      });
    },
    updateGoal(newGoal, oldGoal) {
      oldGoal.title = newGoal.title;
      oldGoal.time = newGoal.time;
      return oldGoal;
    },
    setGoals(goals, day: string) {
      self.goals.replace(goals);
      self.day = day;
    },
    clearGoals() {
      self.goals.replace([]);
    },
  }))
  .actions((self) => ({
    async getGoalsForDay(day: string) {
      return self.environment.api
        .getDailyGoals(day)
        .then((res) => {
          if (res.kind === "ok") {
            if (day === self.day) {
              __DEV__ && console.log("filtering for new goals");
              const oldGoals = [...self.goals]; // clone old goals
              const newGoals = [];
              res.goals.forEach((goal) => {
                const oldGoalsFiltered = oldGoals.filter((oldGoal) => oldGoal.id === goal.id);
                if (oldGoalsFiltered.length === 0) {
                  // If the goal is not present, add the new goal as is
                  newGoals.push(goal);
                } else {
                  newGoals.push(self.updateGoal(goal, oldGoalsFiltered[0]));
                }
              });
              self.setGoals(newGoals, day)
            } else {
              self.setGoals(
                res.goals.map((g) => DailyGoalModel.create(g)),
                day,
              );
            }
          } else {
            __DEV__ && console.log("Could not get daily goals: " + res);
          }
        })
        .catch((err) => __DEV__ && console.error(err));
    },
  }));

// eslint-disable-line @typescript-eslint/no-unused-vars
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
