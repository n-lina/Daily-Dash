describe("TimeMode", () => {
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

  it("should have no goals and set time mode to 12 hr", async () => {
    await waitFor(element(by.id("homeScreenWrap")))
      .toExist()
      .withTimeout(10000);
    await expect(element(by.id("homeScreenWrap"))).toBeVisible();
    await expect(element(by.id("noGoalsMessage"))).toBeVisible();
    await element(by.id("profileTabButton")).tap();
    await waitFor(element(by.text("12 HR")))
      .toExist()
      .withTimeout(1000);
    await element(by.text("12 HR")).tap();
  });

  it("should navigate to goals page", async () => {
    await element(by.id("goalsTabButton")).tap();
    await expect(element(by.id("ltgWrap"))).toBeVisible();
  });

  it("should go to add goals page", async () => {
    await element(by.id("newGoalButton")).tap();
    await waitFor(element(by.id("goalFormWrap")))
      .toExist()
      .withTimeout(1000);
  });

  it("should fill out form", async () => {
    await element(by.id("titleInput")).typeText("Get really strong");
    await element(by.id("descriptionInput")).typeText(
      "Right now I can only bench press 5 lbs :("
    );
    await element(by.id("descriptionInput")).tapReturnKey();
    await element(by.id("stgTitle0")).typeText("Go to the gym");
    await element(by.id("stgTitle0")).tapReturnKey();
    await new Promise((resolve) => setTimeout(resolve, 100));
    await element(by.id("hourInput0")).typeText("12");
    await element(by.id("minInput0")).typeText("14");
    await element(by.id("minInput0")).tapReturnKey();
    await new Promise((resolve) => setTimeout(resolve, 100));
    await element(by.text("PM")).tap();
    await element(by.id("newSTGButton")).tap();
    await waitFor(element(by.id("stgTitle1")))
      .toExist()
      .withTimeout(2000);
    await element(by.id("stgTitle1")).typeText("Eat some spinach");
    await element(by.id("stgTitle1")).tapReturnKey();
    await new Promise((resolve) => setTimeout(resolve, 100));
    await element(by.id("hourInput1")).typeText("12");
    await element(by.id("minInput1")).typeText("15");
    await element(by.id("minInput1")).tapReturnKey();
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  it("should set time moode to 24 hr", async () => {
    await element(by.id("profileTabButton")).tap();
    await waitFor(element(by.text("24 HR")))
      .toExist()
      .withTimeout(1000);
    await element(by.text("24 HR")).tap();
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  it("should have valid long term goal still", async () => {
    await element(by.id("goalsTabButton")).tap();
    await waitFor(element(by.id("hourInput0")))
      .toExist()
      .withTimeout(1000);
    await expect(element(by.id("hourInput0"))).toHaveText("12");
    await expect(element(by.id("hourInput1"))).toHaveText("0");
  });

  it("should submit long term goal", async () => {
    await waitFor(element(by.id("submitGoalButton")))
      .toExist()
      .withTimeout(1000);
    await element(by.id("submitGoalButton")).tap();
    await waitFor(element(by.id("ltgWrap")))
      .toExist()
      .withTimeout(1000);
  });

  it("should display daily goals with valid 24 hr time", async () => {
    await element(by.id("homeTabButton")).tap();
    await waitFor(element(by.id("homeScreenWrap")))
      .toExist()
      .withTimeout(10000);
    await expect(element(by.id("homeScreenWrap"))).toBeVisible();
    await expect(element(by.text("12:14"))).toBeVisible();
    await expect(element(by.text("0:15"))).toBeVisible();
  });

  it("should display daily goals with valid 12 hr time", async () => {
    await element(by.id("profileTabButton")).tap();
    await waitFor(element(by.text("12 HR")))
      .toExist()
      .withTimeout(1000);
    await element(by.text("12 HR")).tap();
    await element(by.id("homeTabButton")).tap();
    await waitFor(element(by.id("homeScreenWrap")))
      .toExist()
      .withTimeout(10000);
    await expect(element(by.id("homeScreenWrap"))).toBeVisible();
    await expect(element(by.text("12:14 pm"))).toBeVisible();
    await expect(element(by.text("12:15 am"))).toBeVisible();
  });

  it("should delete goal as clean up", async () => {
    await element(by.id("goalsTabButton")).tap();
    await expect(element(by.id("ltgWrap"))).toBeVisible();
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
