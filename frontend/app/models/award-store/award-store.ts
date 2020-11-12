import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { string } from "mobx-state-tree/dist/internal"
import { withEnvironment } from "../extensions/with-environment";

/**
 * Model description here for TypeScript hints.
 */
export const AwardStoreModel = types
  .model("AwardStore")
  .props({
    awards: types.optional(types.array(types.array(string)), [["No Awards Yet ...", "Keep completing goals to get one soon!"]]),
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .extend(withEnvironment)
  .actions(self => ({
    setAwards: (AwardsList) => {
      if (AwardsList) {
        __DEV__ && console.log("Setting Awards list " + AwardsList.toString());
        self.awards = AwardsList;
      } else { __DEV__ && console.log("Unsetting Awards list"); }
    },
  })).actions( self => ({
    getAllAwards: () => {
      return self.environment.api.getAllAwards().then(res => {
        if (res.kind === "ok") {
          self.setAwards(res.awards);
          __DEV__ && console.log("Got list of LT goals");
        } else {
          __DEV__ && console.log(res.kind);
        }
      }).catch(err => {
        __DEV__ && console.error(err);
      });
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type AwardStoreType = Instance<typeof AwardStoreModel>
export interface AwardStore extends AwardStoreType {}
type AwardStoreSnapshotType = SnapshotOut<typeof AwardStoreModel>
export interface AwardStoreSnapshot extends AwardStoreSnapshotType {}
