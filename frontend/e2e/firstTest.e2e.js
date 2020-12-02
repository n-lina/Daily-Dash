describe("First screen", () => {
  // beforeEach(async () => {
  //   await device.reloadReactNative();
  // });

  it("should have welcome screen", async () => {
    await waitFor(element(by.id("welcomeMessage")))
      .toExist()
      .withTimeout(5000);
    await expect(element(by.id("welcomeMessage"))).toBeVisible();
  });

  it("should show sign in screen after tap", async () => {
    await element(by.id("nextScreenButton")).tap();
    await expect(element(by.id("signInWrap"))).toBeVisible();
  });
});
