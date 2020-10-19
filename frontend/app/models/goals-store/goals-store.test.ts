import { GoalsStoreModel, GoalsStore } from "./goals-store"

test("can be created", () => {
  const instance: GoalsStore = GoalsStoreModel.create({})

  expect(instance).toBeTruthy()
})