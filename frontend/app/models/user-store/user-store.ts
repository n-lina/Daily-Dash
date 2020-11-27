import { Instance, SnapshotOut, types } from "mobx-state-tree";
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

const awards: Award[] = [{
  title: "Baby Steps",
  description: "Completed 2 sub-goals.",
  threshold: 2
}, {
  title: "Getting the Hang of It",
  description: "Completed 10 sub-goals.",
  threshold: 10
}, {
  title: "Rookie Goal Achiever",
  description: "Completed 25 sub-goals.",
  threshold: 25
}, {
  title: "Novice Goal Achiever",
  description: "Completed 50 sub-goals.",
  threshold: 50
}, {
  title: "Beginner Goal Achiever",
  description: "Completed 100 sub-goals.",
  threshold: 100
}, {
  title: "Intermediate Goal Achiever",
  description: "Completed 250 sub-goals.",
  threshold: 250
}, {
  title: "Senior Goal Achiever",
  description: "Completed 500 sub-goals.",
  threshold: 500
}, {
  title: "Expert Goal Achiever",
  description: "Completed 750 sub-goals.",
  threshold: 750
}, {
  title: "Master Goal Achiever",
  description: "Completed 1000 sub-goals.",
  threshold: 1000
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
      return self.goalsCompleted.toString().length;
    },
    getAwards: (includeNoAward = true): Award[] => {
      const validAwards = awards.filter(award => award.threshold <= self.goalsCompleted);
      if (validAwards.length === 0 && includeNoAward) return [noAward];
      return validAwards;
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    setUser: (user) => {
      if (user) { __DEV__ && console.log("Setting user " + user.toString()); } else { __DEV__ && console.log("unsetting user"); }
      if (user && user.name && user.email) {
        self.name = user.name;
        self.email = user.email;
        self.signedIn = true;
        self.goalsCompleted = user.goalsCompleted;
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
    },
    decrementGoalCount: () => {
      self.goalsCompleted--;
    },
    is24HourClock: () => {
      return self.timeMode == 24;
    }
  }))
  .views(self => ({
    getGoalsForNextLevel: () => {
      return Math.pow(10, self.getLevel());
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
