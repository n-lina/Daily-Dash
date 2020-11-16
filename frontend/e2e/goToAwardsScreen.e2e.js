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
    await waitFor(element(by.id("homeSreenWrap")))
      .toExist()
      .withTimeout(10000)
    await expect(element(by.id("homeSreenWrap"))).toBeVisible()
  })

  it("should have no awards", async () => {
    await expect(element(by.id("awardsString"))).toHaveText("0 awards")
  })

  it("should see default award on screen", async () => {
    await element(by.id("awardsStar")).tap()
    await expect(element(by.text("No Awards Yet..."))).toExist()
  })
})