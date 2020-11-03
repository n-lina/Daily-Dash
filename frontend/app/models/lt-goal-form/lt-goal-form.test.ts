import { LtGoalFormModel, LtGoalForm } from "./lt-goal-form";

test("can be created", () => {
  const instance: LtGoalForm = LtGoalFormModel.create({});

  expect(instance).toBeTruthy();
});
