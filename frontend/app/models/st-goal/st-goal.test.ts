import { StGoalModel, StGoal } from "./st-goal"

test("can be created", () => {
  const instance: StGoal = StGoalModel.create({})

  expect(instance).toBeTruthy()
})
