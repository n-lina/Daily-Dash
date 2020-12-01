import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { Alert, ToastAndroid } from "react-native";
import { withEnvironment } from "../extensions/with-environment";

interface Award {
  title: string
  description: string
  threshold: number
}

const noAward: Award = {
  title: "No Awards Yet...",
  description: "Keep completing goals to earn one soon!",
  threshold: 0
};

const awardThresholds: number[] = [3, 10, 25, 50, 100, 250, 500, 750, 1000];

const toastAndroid = (message: string) => {
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.LONG,
    ToastAndroid.TOP,
  );
};

const awards: Award[] = [{
  title: "Baby Steps",
  description: `Completed ${awardThresholds[0]} sub-goals.`,
  threshold: awardThresholds[0]
}, {
  title: "Getting the Hang of It",
  description: `Completed ${awardThresholds[1]} sub-goals.`,
  threshold: awardThresholds[1]
}, {
  title: "Rookie Goal Achiever",
  description: `Completed ${awardThresholds[2]} sub-goals.`,
  threshold: awardThresholds[2]
}, {
  title: "Novice Goal Achiever",
  description: `Completed ${awardThresholds[3]} sub-goals.`,
  threshold: awardThresholds[3]
}, {
  title: "Beginner Goal Achiever",
  description: `Completed ${awardThresholds[4]} sub-goals.`,
  threshold: awardThresholds[4]
}, {
  title: "Intermediate Goal Achiever",
  description: `Completed ${awardThresholds[5]} sub-goals.`,
  threshold: awardThresholds[5]
}, {
  title: "Senior Goal Achiever",
  description: `Completed ${awardThresholds[6]} sub-goals.`,
  threshold: awardThresholds[6]
}, {
  title: "Expert Goal Achiever",
  description: `Completed ${awardThresholds[7]} sub-goals.`,
  threshold: awardThresholds[7]
}, {
  title: "Master Goal Achiever",
  description: `Completed ${awardThresholds[8]} sub-goals.`,
  threshold: awardThresholds[8]
},];

/**
 * Model description here for TypeScript hints.
 */
export const UserStoreModel = types
  .model("UserStore")
  .props({
    name: types.optional(types.string, ""),
    email: types.optional(types.string, ""),
    signedIn: types.optional(types.boolean, false),
    goalsCompleted: types.optional(types.number, 0),
    timeMode: types.optional(types.number, 12)
  })
  .extend(withEnvironment)
  .views(self => ({
    getLevel: (): number => {
      if (self.goalsCompleted === 0) return 0;
      return Math.floor(Math.log2(self.goalsCompleted)) + 1;
    },
    getAwards: (includeNoAward = true): Award[] => {
      const validAwards = awards.filter(award => award.threshold <= self.goalsCompleted);
      if (validAwards.length === 0 && includeNoAward) return [noAward];
      return validAwards;
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    setUser: (user) => {
      if (user) { __DEV__ && console.log("Setting user " + user.toString()); } else { __DEV__ && console.log("unsetting user"); }
      if (user && user.name && user.email) {
        self.name = user.name;
        self.email = user.email;
        self.signedIn = true;
        self.goalsCompleted = Math.max(0, user.goalsCompleted);
        self.timeMode = user.timeMode;
      } else {
        self.signedIn = false;
        self.name = "";
        self.email = "";
        self.goalsCompleted = 0;
        self.timeMode = 12;
      }
    },
    incrementGoalCount: () => {
      console.log("Incrementing goals");
      self.goalsCompleted++;
      if (Math.log2(self.goalsCompleted) % 1 == 0) {
        toastAndroid(
          "🎉 Level Up !! 🎉" +
          `You are now on Level ${self.getLevel()}! 🔥 Keep up the great work.`,
        );
      }
      if (awardThresholds.includes(self.goalsCompleted)) {
        const myAwards = self.getAwards(false);
        const myTitle = (myAwards.length > 0) ? myAwards[myAwards.length - 1].title : "Getting Started ...";
        toastAndroid(
          "🎉 Congratulations !! 🎉" +
          `You just earned the "${myTitle}" award! ⭐ Keep it up! ⭐`
        );
      }
    },
    decrementGoalCount: () => {
      if (self.goalsCompleted > 0) { self.goalsCompleted--; }
    },
    is24HourClock: () => {
      return self.timeMode == 24;
    }
  }))
  .views(self => ({
    getGoalsForNextLevel: () => {
      const ret = Math.pow(2, self.getLevel());
      return ret;
    }
  }))
  .actions(self => ({
    postUser: (name: string, email: string, id: string) => {
      self.environment.api.postUserSignIn(id, name, email).then(res => {
        if (res.kind === "ok") {
          self.setUser(res.user);
          __DEV__ && console.log("got response");
        } else {
          __DEV__ && console.log(res.kind + " error posting user");
        }
      }).catch(err => {
        __DEV__ && console.error(err + " Could not sign in");
      });
    },

    getUser: (id: string) => {
      return self.environment.api.getUser(id).then(res => {
        if (res.kind === "ok") {
          self.setUser(res.user);
          __DEV__ && console.log("got response");
        } else {
          __DEV__ && console.log(res.kind);
        }
      }).catch(err => {
        __DEV__ && console.error(err);
      });
    },

    signUserOut: () => {
      return self.environment.api.signOut().then(res => {
        if (res.kind === "ok") {
          self.setUser(null);
          __DEV__ && console.log("successful signout");
        } else {
          self.setUser(null);
          __DEV__ && console.log(res.kind + " Did not delete user notification token");
        }
      }).catch(err => {
        __DEV__ && console.log(err + " Could not sign user out");
      });
    },

    updateTimeMode: async (mode: number) => {
      self.timeMode = mode;
      return self.environment.api.putUserTimeMode(mode).then(res => {
        if (res.kind === "ok") {
          __DEV__ && console.log("successful timemode change");
        } else {
          __DEV__ && console.log(res.kind + " Did not update timemode");
        }
      }).catch(err => {
        __DEV__ && console.log(err + " Could not update timemode");
      });
    }
  }));

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}
