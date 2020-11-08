import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { withEnvironment } from "../extensions/with-environment";

/**
 * Model description here for TypeScript hints.
 */
export const UserStoreModel = types
  .model("UserStore")
  .props({
    name: types.optional(types.string, ""),
    email: types.optional(types.string, ""),
    signedIn: types.optional(types.boolean, false),
    goalsCompleted: types.optional(types.number, 0)
  })
  .extend(withEnvironment)
  .views(self => ({
    getLevel: (): number => {
      if (self.goalsCompleted === 0) return 0;
      return self.goalsCompleted.toString().length;
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
      } else {
        self.signedIn = false;
        self.name = "";
        self.email = "";
        self.goalsCompleted = 0;
      }
    },
    incrementGoalCount: () => {
      console.log("Incrementing goals");
      self.goalsCompleted++;
    },
    decrementGoalCount: () => {
      self.goalsCompleted--;
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
          __DEV__ && console.log(res.kind);
        }
      }).catch(err => {
        __DEV__ && console.error(err);
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
