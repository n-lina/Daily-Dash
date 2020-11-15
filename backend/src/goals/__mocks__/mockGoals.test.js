const request = require('supertest');
const admin = require("firebase-admin");
const server = require('../../index');
const goalsHelper = require("../goalsHelper");
const GoalModel = require("../../models/goals");
const cossimImport = require('../cossim.js');
const goalsSugHelperImport = require('../goalsSugHelper');

describe("Goals integration tests", () => {
  afterAll(async () => {
    await server.shutdown();
  })

  it("should successfully add long term goals", async(done) => {
    request(server)
      .post("/goals")
      .set({ Authorization: "Bearer test"})
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

    const dbResult = await GoalModel.findOne({title: "testGoal2"})

    expect(dbResult.userId).toEqual("eq06XtykrqSHJtqWblOYkhWat6s2");

    done();
  })

  it("should successfully fetch goals", async(done) => {
    const res = await request(server)
      .get("/goals/?id=eq06XtykrqSHJtqWblOYkhWat6s2")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)

    expect(res.body.longTermGoals.length > 0);

    done();
  })

  it("should successfully no fetch goals", async(done) => {
    goalsHelper.getGoalsResponseFromDBResult = jest.fn(() => {
      return {
        "longTermGoals": []
      }
    })

    const res = await request(server)
      .get("/goals/?id=nodata")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)
    
    expect(res.body.longTermGoals.length).toEqual(0);

    done();
  })

  it("should successfully fetch short term goals", async(done) => {
    const res = await request(server)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2&dayOfWeek=mon")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)
    
    expect(res.body.shortTermGoals.length > 0);

    done();
  })

  it("should successfully fetch no short term goals", async(done) => {
    const res = await request(server)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2&dayOfWeek=wed")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)
    
    expect(res.body.shortTermGoals.length).toEqual(0);

    done();
  })
})

describe("Unauthorized Goals endpoints", () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  })

  afterAll(async () => {
    server.close();
  })

  it("should fail to add a new goal because not authorized", (done) => {
    request(server)
      .post("/goals")
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
      .expect(401)
      .end(done);
  })

  it("should fail to get user goals", (done) => {
    request(server)
      .get("/goals/?id=eq06XtykrqSHJtqWblOYkhWat6s2")
      .send()
      .expect(401)
      .end(done);
  })

  it("should fail to get short term goals because of missing parameters", (done) => {
    request(server)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2&dayOfWeek=mon")
      .send()
      .expect(401)
      .end(done);
  })

  test("should fail to get suggested STG title", async(done) => {
    goalsSugHelperImport.checkHasWords = jest.fn(stringParam => true);
    goalsSugHelperImport.fillArrayWithValidLTGtitles = jest.fn((arrayParam, cacheLTGsArray_) => arrayParam.push("LTG test title"));
    goalsSugHelperImport.fillArrayWithValidSTGtitles = jest.fn((arrayParamSTG, highestCossimLTGTitle) => arrayParamSTG.push("STG test title"));
    cossimImport.getCosSim = jest.fn((str1, str2) => .67);

    request(server)
      .get("/goals/suggestedstg?title=bingo")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(401)

    done();
  })
  
})

describe("Goals endpoints", () => {
  beforeEach(async () => {
    admin.auth().verifyIdToken = jest.fn(() => new Promise((resolve) => {
      resolve({
        email: "tests"
      });
    }));
  });

  afterAll(async () => {
    await server.shutdown();
  })

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
  })

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
  })

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
    }});

    request(server)
      .get("/goals/?id=eq06XtykrqSHJtqWblOYkhWat6s2")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send()
      .expect(200)
      .end(done);
  })

  it("should fail to get user goals because of missing parameters", (done) => {
    request(server)
      .get("/goals/?idsss=eq06XtykrqSHJtqWblOYkhWat6s2")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send()
      .expect(400)
      .end(done);
  })

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
      }
    });

    request(server)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2&dayOfWeek=mon")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send()
      .expect(200)
      .end(done);
  })

  it("should fail to get short term goals because of missing parameters", (done) => {
    goalsHelper.getShortTermGoals = jest.fn(() => {
      return {
        "shortTermGoals": []
      }
    });

    request(server)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send()
      .expect(400)
      .end(done);
  })

  it("should fail to get short term goals because incorrect day of week", (done) => {
    goalsHelper.getShortTermGoals = jest.fn(() => {
      return {
        "shortTermGoals": []
      }
    });

    request(server)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2&dayOfWeek=modn")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send()
      .expect(500)
      .end(done);
  })
})

describe("Goals integration tests", () => {
  afterAll(async () => {
    await server.shutdown();
  })

  it("should successfully add long term goals", async(done) => {
    request(server)
      .post("/goals")
      .set({ Authorization: "Bearer test"})
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

    const dbResult = await GoalModel.findOne({title: "testGoal2"})

    expect(dbResult.userId).toEqual("eq06XtykrqSHJtqWblOYkhWat6s2");

    done();
  })

  it("should successfully fetch goals", async(done) => {
    const res = await request(server)
      .get("/goals/?id=eq06XtykrqSHJtqWblOYkhWat6s2")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)
    
    expect(res.body.longTermGoals.length > 0);

    done();
  })

  it("should successfully no fetch goals", async(done) => {
    const res = await request(server)
      .get("/goals/?id=nodata")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)
    
    expect(res.body.longTermGoals.length).toEqual(0);

    done();
  })


  it("should successfully fetch short term goals", async(done) => {
    const res = await request(server)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2&dayOfWeek=mon")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)
    
    expect(res.body.shortTermGoals.length > 0);

    done();
  })

  it("should successfully fetch no short term goals", async(done) => {
    const res = await request(server)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2&dayOfWeek=wed")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)
    
    expect(res.body.shortTermGoals.length).toEqual(0);

    done();
  })
})


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
  })


  test("Should successfully get suggested STG title", async(done) => {
    goalsSugHelperImport.checkHasWords = jest.fn(stringParam => true);
    goalsSugHelperImport.fillArrayWithValidLTGtitles = jest.fn((arrayParam, cacheLTGsArray_) => arrayParam.push("LTG test title"));
    goalsSugHelperImport.fillArrayWithValidSTGtitles = jest.fn((arrayParamSTG, highestCossimLTGTitle) => arrayParamSTG.push("STG test title"));
    cossimImport.getCosSim = jest.fn((str1, str2) => .67);

    const res = await request(server)
      .get("/goals/suggestedstg?title=bingo")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)
          
    expect(res.body.answer).toEqual("STG test title");

    done();
  })

  test("Should get 400 for wrong title input", async(done) => {
    goalsSugHelperImport.checkHasWords = jest.fn(stringParam => false);
    goalsSugHelperImport.fillArrayWithValidLTGtitles = jest.fn((arrayParam, cacheLTGsArray_) => arrayParam.push("LTG test title"));
    goalsSugHelperImport.fillArrayWithValidSTGtitles = jest.fn((arrayParamSTG, highestCossimLTGTitle) => arrayParamSTG.push("STG test title"));
    cossimImport.getCosSim = jest.fn((str1, str2) => .67);

    const res = await request(server)
      .get("/goals/suggestedstg?title=^&")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(400)
      
    done();
  })

  test("Should get success and no-suggestion string since no LTG titles", async(done) => {
    goalsSugHelperImport.checkHasWords = jest.fn(stringParam => true);
    goalsSugHelperImport.fillArrayWithValidLTGtitles = jest.fn((arrayParam, cacheLTGsArray_) => {});
    goalsSugHelperImport.fillArrayWithValidSTGtitles = jest.fn((arrayParamSTG, highestCossimLTGTitle) => arrayParamSTG.push("STG test title"));
    cossimImport.getCosSim = jest.fn((str1, str2) => .67);

    const res = await request(server)
      .get("/goals/suggestedstg?title=bingo")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)
          
    expect(res.body.answer).toEqual("No suggested short term goal.");

    done();
  })

  test("Should get success and no-suggestion string since no STG titles", async(done) => {
    goalsSugHelperImport.checkHasWords = jest.fn(stringParam => true);
    goalsSugHelperImport.fillArrayWithValidLTGtitles = jest.fn((arrayParam, cacheLTGsArray_) => arrayParam.push("LTG test title"));
    goalsSugHelperImport.fillArrayWithValidSTGtitles = jest.fn((arrayParamSTG, highestCossimLTGTitle) => {});
    cossimImport.getCosSim = jest.fn((str1, str2) => .67);

    const res = await request(server)
      .get("/goals/suggestedstg?title=bingo")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)
          
    expect(res.body.answer).toEqual("No suggested short term goal.");

    done();
  })

  test("Should fail to get string because error occurred", async(done) => {
    goalsSugHelperImport.checkHasWords = jest.fn(stringParam => true);
    goalsSugHelperImport.fillArrayWithValidLTGtitles = jest.fn((arrayParam, cacheLTGsArray_) => arrayParam.push("LTG test title"));
    goalsSugHelperImport.fillArrayWithValidSTGtitles = jest.fn((arrayParamSTG, highestCossimLTGTitle) => arrayParamSTG.push("STG test title"));
    cossimImport.getCosSim = jest.fn((str1, str2) => {throw new Error("Parameters not string")});

    const res = await request(server)
      .get("/goals/suggestedstg?title=bingo")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(500)

    done();
  })

})
