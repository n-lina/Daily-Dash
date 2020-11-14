const request = require('supertest');
const admin = require("firebase-admin");
const server = require('../../index');
const GoalModel = require("../../models/goals");

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

  it("should fail to a new goal when request parameters are missing", (done) => {
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
    request(server)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2&dayOfWeek=mon")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send()
      .expect(200)
      .end(done);
  })

  it("should fail to get short term goals because of missing parameters", (done) => {
    request(server)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send()
      .expect(400)
      .end(done);
  })

  it("should fail to get short term goals because of missing parameters", (done) => {
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