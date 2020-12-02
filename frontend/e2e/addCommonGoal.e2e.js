describe("AddCommonGoal", () => {
  it("should successfully sign in with test user", async () => {
    try {
      // try here because sometimes dev mode needs to load twice?
      await waitFor(element(by.id("welcomeMessage")))
        .toExist()
        .withTimeout(20000);
      await element(by.id("nextScreenButton")).tap();
      await element(by.id("testSignIn")).tap();
    } catch (err) {
      await waitFor(element(by.id("welcomeMessage")))
        .toExist()
        .withTimeout(20000);
      await element(by.id("nextScreenButton")).tap();
      await element(by.id("testSignIn")).tap();
    }
  });

  it("should show home screen with no goals present", async () => {
    await waitFor(element(by.id("homeScreenWrap")))
      .toExist()
      .withTimeout(10000);
    await expect(element(by.id("homeScreenWrap"))).toBeVisible();
    await expect(element(by.id("noGoalsMessage"))).toBeVisible();
  });

  it("should navigate to goals page", async () => {
    await element(by.id("goalsTabButton")).tap();
    await expect(element(by.id("ltgWrap"))).toBeVisible();
  });

  it("should go to common goals page", async () => {
    await expect(element(by.id("commonGoalsButton"))).toBeVisible();
    await element(by.id("commonGoalsButton")).tap();
    await waitFor(element(by.id("commonScreenWrap")))
      .toExist()
      .withTimeout(1000);
  });

  it("should pick one of the common goals and add it", async () => {
    await expect(element(by.id("commonGoal0"))).toBeVisible();
    await waitFor(element(by.id("commonGoal0")))
      .toExist()
      .withTimeout(1000);
    await element(by.id("commonGoal0")).tap();
    await expect(element(by.id("addCommonGoalButton"))).toBeVisible();
    await element(by.id("addCommonGoalButton")).tap();
  });

  it("should delete goal as clean up", async () => {
    await element(by.id("goalsTabButton")).tap();
    await expect(element(by.id("ltgWrap"))).toBeVisible();
    await expect(element(by.id("ltGoal0"))).toBeVisible();
    await element(by.id("ltGoal0")).tap();
    await waitFor(element(by.id("deleteGoalButton")))
      .toExist()
      .withTimeout(1000);
    await element(by.id("deleteGoalButton")).tap();
    await element(by.text("Yes")).tap();
    await waitFor(element(by.id("ltgWrap")))
      .toExist()
      .withTimeout(1000);
  });
});
