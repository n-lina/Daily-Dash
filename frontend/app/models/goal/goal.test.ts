import { GoalModel, Goal } from "./goal"

test("can be created", () => {
  const instance: Goal = GoalModel.create({})

  expect(instance).toBeTruthy()
})