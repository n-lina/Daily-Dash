describe("Awards", () => {
  it("should successfully sign in with test user", async () => {
    try {
      // try here because sometimes dev mode needs to load twice?
      await waitFor(element(by.id("welcomeMessage")))
        .toExist()
        .withTimeout(20000)
      await element(by.id("nextScreenButton")).tap()
      await element(by.id("testSignIn")).tap()
    } catch (err) {
      await waitFor(element(by.id("welcomeMessage")))
        .toExist()
        .withTimeout(20000)
      await element(by.id("nextScreenButton")).tap()
      await element(by.id("testSignIn")).tap()
    }
  })

  it("should show home screen after signing in", async () => {
    await waitFor(element(by.id("homeScreenWrap")))
      .toExist()
      .withTimeout(10000)
    await expect(element(by.id("homeScreenWrap"))).toBeVisible()
  })

  it("should have no awards", async () => {
    await element(by.id("profileTabButton")).tap()
    await expect(element(by.id("profileScreenWrap"))).toBeVisible()
    await expect(element(by.id("awardsString"))).toHaveText("0 Awards")
  })

  it("should see default award on screen", async () => {
    await element(by.id("awardsStar")).tap()
    await expect(element(by.text("No Awards Yet..."))).toExist()
  })
})
