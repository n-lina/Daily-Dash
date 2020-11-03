import { DailyGoalModel, DailyGoal } from "./daily-goal";

test("can be created", () => {
  const instance: DailyGoal = DailyGoalModel.create({});

  expect(instance).toBeTruthy();
});
