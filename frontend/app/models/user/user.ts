import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"

/**
 * Model description here for TypeScript hints.
 */
export const UserModel = types
  .model("User")
  .props({
    name: types.string,
    email: types.string
  })
  .extend(withEnvironment)
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    setUser: (user) => {
      self.name = user.name;
      self.email = user.email;
    }
  })).actions(self => ({
    postUser: (name: string, email: string, token: string) => {
      self.environment.api.postUserSignIn(token, name, email).then(res => {
        if (res.kind == "ok") {
          self.setUser(res.user);
        } else {
          __DEV__ && console.tron.log(res.kind);
        }
      }).catch(err => {
        __DEV__ && console.error(err);
      })
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type UserType = Instance<typeof UserModel>
export interface User extends UserType {}
type UserSnapshotType = SnapshotOut<typeof UserModel>
export interface UserSnapshot extends UserSnapshotType {}
