const request = require("supertest");
const rewire = require("rewire");
const admin = require("firebase-admin");
const server = require("../../index");
const goals = rewire("../goals");
const goalsHelper = require("../goalsHelper");
const auth = require("../../firebase/auth");
const logger = require("../../logger/logging");
const cossimImport = require("../cossim.js");
const goalsSugHelperImport = require("../goalsSugHelper");

describe("Goals mock tests", () => {
  beforeEach(async () => {
    logger.transports.forEach((t) => (t.silent = true));
    jest.useFakeTimers();
    jest.runAllTimers();
    jest.setTimeout(30000);

    admin.auth().verifyIdToken = jest.fn(() => new Promise((resolve) => {
      resolve({
        email: "tests"
      });
    }));

    goalsHelper.updateGoal = jest.fn(() => {});
    goalsHelper.getShortTermGoalsResponseFromDbResult = jest.fn(() => {});
    goalsHelper.completeShortTermGoal = jest.fn(() => {});
    goalsHelper.getGoalsResponseFromDBResult = jest.fn(() => {});
    auth.checkIfAuthenticated = jest.fn(() => new Promise((resolve) => {
      resolve({
        email: "tests"
      });
    }));
  });

  afterEach(async () => {
    await server.close();
  });

  it("should successfully add a new goal using the parameters", () => {
    const addGoal = goals.__get__("addGoal");

    const testShortTermGoals = [
      {
			"title": "Do a coding challenge practice problem each weekday.",
			"mon": [
				5,
				15
			],
			"wed": [
				30,
				20
			]
		}];

    addGoal("testUser", "testAdd", "testDescription", testShortTermGoals)
    .then(data => expect(data).toEqual({id: "testUser"}));
  });

  it("should successfully get user goals using the parameters", () => {
    const findGoals = goals.__get__("findGoals");

    findGoals("testUser")
    .then(data => expect(data).toEqual({
      "longTermGoals": [
        {
          "title": "testAdd",
          "description": "testDescription",
          "shortTermGoals": [
            {
              "title": "STG1",
              "mon": [
                699,
                15
              ],
              "tue": [],
              "wed": [],
              "thu": [],
              "fri": [],
              "sat": [],
              "sun": []
            }
          ]
        }
      ]
    })
    );
  });

  it("should successfully get user short term goals using the parameters", () => {
    const findShortTermGoalsGoals = goals.__get__("findGoals");

    findShortTermGoalsGoals("testUser", "mon")
    .then(data => expect(data).toEqual({
      "shortTermGoals": [
        {
          "title": "testAdd."
        }
      ]
    }));
  });

  it("should successfully add a new goal", (done) => {
    request(server)
      .post("/goals")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send({
        "userId": "eq06XtykrqSHJtqWblOYkhWat6s2",
        "title": "testGoal2",
        "description": "testRunning",
        "shortTermGoals": [
          {
            "title": "STG1",
            "description": "testRunWeekdays",
            "mon": [
              699,
              15
            ]
          }
        ]
      })
      .expect(200)
      .end(done);
  });

  it("should fail to add a new goal when request parameters are missing", (done) => {
    request(server)
      .post("/goals")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send({
        "userId": "eq06XtykrqSHJtqWblOYkhWat6s2",
        "shortTermGoals": [
          {
            "title": "STG1",
            "description": "testRunWeekdays",
            "mon": [
              699,
              15
            ]
          }
        ]
      })
      .expect(400)
      .end(done);
  });

  it("should successfully get user goals", (done) => {
    goalsHelper.getGoalsResponseFromDBResult = jest.fn(() => {
      return {
      "userId": "testUser3",
      "title": "Become a great coder within 6 months.",
      "description": "irrelevant words",
      "shortTermGoals": [
        {
          "title": "Do a coding challenge practice problem each weekday.",
          "mon": [
            5,
            15
          ],
          "wed": [
            30,
            20
          ]
        }
      ]
    };});

    request(server)
      .get("/goals/?id=eq06XtykrqSHJtqWblOYkhWat6s2")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send()
      .expect(200)
      .end(done);
  });

  it("should fail to get user goals because of missing parameters", (done) => {
    request(server)
      .get("/goals/?idsss=eq06XtykrqSHJtqWblOYkhWat6s2")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send()
      .expect(400)
      .end(done);
  });

  it("should successfully get short term goals", (done) => {
    goalsHelper.getShortTermGoals = jest.fn(() => {
      return {
        "shortTermGoals": [
          {
            "stgId": "5fb085e26d499219752df1d4",
            "title": "Do a coding challenge practice problem each weekday.",
            "time": 5
          },
        ]
      };
    });

    request(server)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2&dayOfWeek=mon")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send()
      .expect(200)
      .end(done);
  });

  it("should fail to get short term goals because of missing parameters", (done) => {
    goalsHelper.getShortTermGoals = jest.fn(() => {
      return {
        "shortTermGoals": []
      };
    });

    request(server)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send()
      .expect(400)
      .end(done);
  });

  it("should fail to get short term goals because incorrect day of week", (done) => {
    goalsHelper.getShortTermGoals = jest.fn(() => {
      return {
        "shortTermGoals": []
      };
    });

    request(server)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2&dayOfWeek=modn")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send()
      .expect(200)
      .end(done);
  });
});

describe("Complex logic endpoint", () => {

  beforeEach(async () => {
    admin.auth().verifyIdToken = jest.fn(() => new Promise((resolve) => {
      resolve({
        email: "tests"
      });
    }));
  });

  afterAll(async () => {
    await server.shutdown();
  });

  const expectedGetCosSimResult = 0.67;

  test("Should successfully get suggested STG title", async(done) => {
    goalsSugHelperImport.checkHasWords = jest.fn(() => true);
    goalsSugHelperImport.fillArrayWithValidLTGtitles = jest.fn(arrayParam => arrayParam.push("LTG test title"));
    goalsSugHelperImport.fillArrayWithValidSTGtitles = jest.fn(arrayParamSTG => arrayParamSTG.push("STG test title"));
    cossimImport.getCosSim = jest.fn(() => expectedGetCosSimResult);

    const res = await request(server)
      .get("/goals/suggestedstg?title=bingo")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200);
          
    expect(res.body.answer).toEqual("STG test title");

    done();
  });

  test("Should get 400 for wrong title input", async(done) => {
    goalsSugHelperImport.checkHasWords = jest.fn(() => false);
    goalsSugHelperImport.fillArrayWithValidLTGtitles = jest.fn(arrayParam => arrayParam.push("LTG test title"));
    goalsSugHelperImport.fillArrayWithValidSTGtitles = jest.fn(arrayParamSTG => arrayParamSTG.push("STG test title"));
    cossimImport.getCosSim = jest.fn(() => expectedGetCosSimResult);

    await request(server)
      .get("/goals/suggestedstg?title=^&")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(400);
      
    done();
  });

  test("Should get success and no-suggestion string since no LTG titles", async(done) => {
    goalsSugHelperImport.checkHasWords = jest.fn(() => true);
    goalsSugHelperImport.fillArrayWithValidLTGtitles = jest.fn(() => {});
    goalsSugHelperImport.fillArrayWithValidSTGtitles = jest.fn(arrayParamSTG => arrayParamSTG.push("STG test title"));
    cossimImport.getCosSim = jest.fn(() => expectedGetCosSimResult);

    await request(server)
      .get("/goals/suggestedstg?title=bingo")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200);

    done();
  });

  test("Should get success and no-suggestion string since no STG titles", async(done) => {
    goalsSugHelperImport.checkHasWords = jest.fn(() => true);
    goalsSugHelperImport.fillArrayWithValidLTGtitles = jest.fn((arrayParam) => arrayParam.push("LTG test title"));
    goalsSugHelperImport.fillArrayWithValidSTGtitles = jest.fn(() => {});
    cossimImport.getCosSim = jest.fn(() => expectedGetCosSimResult);

    const res = await request(server)
      .get("/goals/suggestedstg?title=bingo")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200);
          
    expect(res.body.answer).toEqual("No suggested short term goal.");

    done();
  });

  test("Should fail to get string because error occurred", async(done) => {
    goalsSugHelperImport.checkHasWords = jest.fn(() => true);
    goalsSugHelperImport.fillArrayWithValidLTGtitles = jest.fn(arrayParam => arrayParam.push("LTG test title"));
    goalsSugHelperImport.fillArrayWithValidSTGtitles = jest.fn(arrayParamSTG => arrayParamSTG.push("STG test title"));
    cossimImport.getCosSim = jest.fn(() => {throw new Error("Parameters not string");});
    
    await request(server)
      .get("/goals/suggestedstg?title=bingo")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(500);

    done();
  });
});