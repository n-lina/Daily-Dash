import { StGoalFormModel, StGoalForm } from "./st-goal-form"

test("can be created", () => {
  const instance: StGoalForm = StGoalFormModel.create({})

  expect(instance).toBeTruthy()
})
