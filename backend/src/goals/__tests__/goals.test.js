const request = require('supertest');
const admin = require("firebase-admin");
const server = require('../../index');
const cossimImport = require('../cossim.js');
const goalsSugHelperImport = require('../goalsSugHelper');
const logger = require("../../logger/logging");

describe("Goals integration tests", () => {
  afterAll(async () => {
    await server.shutdown();
  })

  beforeEach(() => {
    logger.transports.forEach((t) => (t.silent = true));
    jest.useFakeTimers();
    jest.runAllTimers();
    jest.setTimeout(30000);
  })

  it("should successfully add user and long term goals", async(done) => {
    await request(server)
    .post("/users")
    .set({ Authorization: "Bearer test"})
    .send({
      "id": "eq06XtykrqSHJtqWblOYkhWat6s2",
      "email": "sdff2",
      "username": "dff",
      "notificationId": "",
    })
    .expect(200);
    
    await request(server)
      .post("/goals")
      .set({ Authorization: "Bearer test"})
      .send({
        "userId": "eq06XtykrqSHJtqWblOYkhWat6s2",
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
          },
          {
            "title": "Every week, make a project that helps out mom and dad.",
            "sat": [
              5,
              15
            ],
            "sun": [
              30,
              20
            ]
          }
        ]
      })
      .expect(200);

    done();
  })

  it("should fail to add long term goals due to missing params", async(done) => {
    await request(server)
      .post("/goals")
      .set({ Authorization: "Bearer test"})
      .send({
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
      .expect(400)

    done();
  })

  it("should successfully fetch suggested goals", async(done) => {
    await request(server)
      .get("/goals/suggestedstg?title=guitar")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)

    done();
  })

  it("should successfully fetch goals", async(done) => {
    const res = await request(server)
      .get("/goals/?id=eq06XtykrqSHJtqWblOYkhWat6s2")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)

    console.log(res.body)

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

  it("should fail to fetch goals due to missing params", async(done) => {
    await request(server)
      .get("/goals/?idd=sd")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(400)

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
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWatf6s2&dayOfWeek=wed")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)
    
    expect(res.body.shortTermGoals.length).toEqual(0);

    done();
  })

  it("should fail to fetch short term goals due to missing params", async(done) => {
    await request(server)
      .get("/goals/shortterm?idd=ss")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(400)

    done();
  })

  it("should fail to fetch short term goals due to missing params id", async(done) => {
    await request(server)
      .get("/goals/shortterm")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(400)

    done();
  })

  it("should fail to get short term goals because incorrect day of week", (done) => {
    request(server)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2&dayOfWeek=modn")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(500)
      .end(done);
  })
})

describe("Unauthorized Goals Tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.runAllTimers();
    jest.setTimeout(30000);
  })

  afterAll(async () => {
    await server.close();
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
    const expectedGetCosSimResult = .67;
    goalsSugHelperImport.checkHasWords = jest.fn(() => true);
    goalsSugHelperImport.fillArrayWithValidLTGtitles = jest.fn((arrayParam) => arrayParam.push("LTG test title"));
    goalsSugHelperImport.fillArrayWithValidSTGtitles = jest.fn((arrayParamSTG) => arrayParamSTG.push("STG test title"));
    cossimImport.getCosSim = jest.fn(() => expectedGetCosSimResult);

    request(server)
      .get("/goals/suggestedstg?title=bingo")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(401)

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

  const expectedGetCosSimResult = .67;

  test("Should successfully get suggested STG title", async(done) => {
    goalsSugHelperImport.checkHasWords = jest.fn(() => true);
    goalsSugHelperImport.fillArrayWithValidLTGtitles = jest.fn(arrayParam => arrayParam.push("LTG test title"));
    goalsSugHelperImport.fillArrayWithValidSTGtitles = jest.fn(arrayParamSTG => arrayParamSTG.push("STG test title"));
    cossimImport.getCosSim = jest.fn(() => expectedGetCosSimResult);

    const res = await request(server)
      .get("/goals/suggestedstg?title=bingo")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)
          
    expect(res.body.answer).toEqual("STG test title");

    done();
  })

  test("Should get 400 for wrong title input", async(done) => {
    goalsSugHelperImport.checkHasWords = jest.fn(() => false);
    goalsSugHelperImport.fillArrayWithValidLTGtitles = jest.fn(arrayParam => arrayParam.push("LTG test title"));
    goalsSugHelperImport.fillArrayWithValidSTGtitles = jest.fn(arrayParamSTG => arrayParamSTG.push("STG test title"));
    cossimImport.getCosSim = jest.fn(() => expectedGetCosSimResult);

    await request(server)
      .get("/goals/suggestedstg?title=^&")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(400)
      
    done();
  })

  test("Should get success and no-suggestion string since no LTG titles", async(done) => {
    goalsSugHelperImport.checkHasWords = jest.fn(() => true);
    goalsSugHelperImport.fillArrayWithValidLTGtitles = jest.fn(() => {});
    goalsSugHelperImport.fillArrayWithValidSTGtitles = jest.fn(arrayParamSTG => arrayParamSTG.push("STG test title"));
    cossimImport.getCosSim = jest.fn(() => expectedGetCosSimResult);

    const res = await request(server)
      .get("/goals/suggestedstg?title=bingo")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)
          
    expect(res.body.answer).toEqual("No suggested short term goal.");

    done();
  })

  test("Should get success and no-suggestion string since no STG titles", async(done) => {
    goalsSugHelperImport.checkHasWords = jest.fn(() => true);
    goalsSugHelperImport.fillArrayWithValidLTGtitles = jest.fn((arrayParam) => arrayParam.push("LTG test title"));
    goalsSugHelperImport.fillArrayWithValidSTGtitles = jest.fn(() => {});
    cossimImport.getCosSim = jest.fn(() => expectedGetCosSimResult);

    const res = await request(server)
      .get("/goals/suggestedstg?title=bingo")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)
          
    expect(res.body.answer).toEqual("No suggested short term goal.");

    done();
  })

  test("Should fail to get string because error occurred", async(done) => {
    goalsSugHelperImport.checkHasWords = jest.fn(() => true);
    goalsSugHelperImport.fillArrayWithValidLTGtitles = jest.fn(arrayParam => arrayParam.push("LTG test title"));
    goalsSugHelperImport.fillArrayWithValidSTGtitles = jest.fn(arrayParamSTG => arrayParamSTG.push("STG test title"));
    cossimImport.getCosSim = jest.fn(() => {throw new Error("Parameters not string")});
    
    await request(server)
      .get("/goals/suggestedstg?title=bingo")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(500)

    done();
  })

})