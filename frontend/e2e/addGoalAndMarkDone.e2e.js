describe("AddGoalAndMarkDone", () => {
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
  
    it("should navigate to goals page", async () => {
      await element(by.id("goalsTabButton")).tap()
      await expect(element(by.id("ltgWrap"))).toBeVisible()
    })
  
    it("should go to add goals page", async () => {
      await element(by.id("newGoalButton")).tap()
      await waitFor(element(by.id("addGoalWrap")))
        .toExist()
        .withTimeout(1000)
    })

    it("should fill out form", async () => {
        await element(by.id("titleInput")).typeText("Get really strong")
        await element(by.id("descriptionInput")).typeText("Right now I can only bench press 5 lbs :(")
        await element(by.id("descriptionInput")).tapReturnKey();
        // await element(by.id('addGoalScroll')).scrollTo('bottom');
        await element(by.id("stgTitle0")).typeText("Go to the gym")
        await element(by.id("hourInput0")).typeText("12")
        await element(by.id("minInput0")).typeText("14")
        await element(by.id("minInput0")).tapReturnKey()
        await element(by.id("newSTGButton")).tap()
        await waitFor(element(by.id("stgTitle1")))
        .toExist()
        .withTimeout(2000)
        await element(by.id("stgTitle1")).typeText("Eat some spinach")
        await element(by.id("hourInput1")).typeText("1")
        await element(by.id("minInput1")).typeText("15")
        await element(by.id("minInput1")).tapReturnKey()
        await waitFor(element(by.id("submitGoalButton")))
        .toExist()
        .withTimeout(1000)
        await element(by.id("submitGoalButton")).tap()
        await waitFor(element(by.id("ltgWrap")))
          .toExist()
          .withTimeout(1000)
      })

      it("should go to home screen", async () => {
        await element(by.id("homeTabButton")).tap()
        await expect(element(by.id("homeSreenWrap"))).toBeVisible()
      })

      it("should mark goals as complete and be reflected in level and score",  async () => {
        await expect(element(by.id("levelNumber"))).toHaveText("0")
        await expect(element(by.id("goalsCompletedDisplay"))).toHaveText("0 / 1")
        await element(by.id("goal0")).tap()
        await element(by.id("goal1")).tap()
        await expect(element(by.id("levelNumber"))).toHaveText("1")
        await expect(element(by.id("goalsCompletedDisplay"))).toHaveText("2 / 10")
      })

      it("should unmark goals as not complete and be reflected in level and score",  async () => {
        await element(by.id("goal0")).tap()
        await element(by.id("goal1")).tap()
        await expect(element(by.id("levelNumber"))).toHaveText("0")
        await expect(element(by.id("goalsCompletedDisplay"))).toHaveText("0 / 1")
      })

      it("should delete goal as clean up", async () => {
        await element(by.id("goalsTabButton")).tap()
        await expect(element(by.id("ltgWrap"))).toBeVisible()
        await element(by.id("ltGoal0")).tap()
        await waitFor(element(by.id("deleteGoalButton")))
        .toExist()
        .withTimeout(1000)
        await element(by.id("deleteGoalButton")).tap()
        await element(by.text("Yes")).tap()
        await waitFor(element(by.id("ltgWrap")))
          .toExist()
          .withTimeout(1000)
      })
  })