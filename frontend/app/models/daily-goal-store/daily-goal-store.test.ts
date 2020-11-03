import { DailyGoalStoreModel, DailyGoalStore } from "./daily-goal-store"

test("can be created", () => {
  const instance: DailyGoalStore = DailyGoalStoreModel.create({})

  expect(instance).toBeTruthy()
})
