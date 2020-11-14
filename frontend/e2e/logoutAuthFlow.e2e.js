describe("Logout", () => {
  it("should have welcome screen", async () => {
    await waitFor(element(by.id("welcomeMessage")))
      .toExist()
      .withTimeout(20000)
  })

  it("should successfully sign in with test user", async () => {
    await element(by.id("nextScreenButton")).tap()
    await element(by.id("testSignIn")).tap()
  })

  it("should show home screen after signing in", async () => {
    await waitFor(element(by.id("homeSreenWrap")))
      .toExist()
      .withTimeout(10000)
    await expect(element(by.id("homeSreenWrap"))).toBeVisible()
  })

  it("should navigate to profile page", async () => {
    await element(by.id("profileTabButton")).tap()
    await expect(element(by.id("profileScreenWrap"))).toBeVisible()
  })

  it("should logout and show welcome screen", async () => {
    await element(by.id("logoutButton")).tap()
    await waitFor(element(by.id("welcomeMessage")))
      .toExist()
      .withTimeout(1000)
    await expect(element(by.id("welcomeMessage"))).toBeVisible()
  })
})
