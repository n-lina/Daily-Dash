import { AwardStoreModel, AwardStore } from "./award-store"

test("can be created", () => {
  const instance: AwardStore = AwardStoreModel.create({})

  expect(instance).toBeTruthy()
})