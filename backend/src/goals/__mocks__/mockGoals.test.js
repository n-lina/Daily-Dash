const request = require('supertest');
const server = require('../../index');
const admin = require("firebase-admin");

describe("Unauthorized Goals endpoints", () => {
  it("should fail to add a new goal because not authorized", async() => {
    const res = await request(server.app)
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
      });

    expect(res.statusCode).toEqual(401);
  })

  it("should fail to get user goals", async() => {
    const res = await request(server.app)
      .get("/goals/?id=eq06XtykrqSHJtqWblOYkhWat6s2")
      .send();

    expect(res.statusCode).toEqual(401);
  })

  it("should fail to get short term goals because of missing parameters", async() => {
    const res = await request(server.app)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2&dayOfWeek=mon")
      .send();

    expect(res.statusCode).toEqual(401);
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
  
  it("should successfully add a new goal", async() => {
    const res = await request(server.app)
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
      });

    expect(res.statusCode).toEqual(200);
  })

  it("should fail to a new goal when request parameters are missing", async() => {
    const res = await request(server.app)
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
      });

    expect(res.statusCode).toEqual(400);
  })

  it("should successfully get user goals", async() => {
    const res = await request(server.app)
      .get("/goals/?id=eq06XtykrqSHJtqWblOYkhWat6s2")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send();

    expect(res.statusCode).toEqual(200);
  })

  it("should fail to get user goals because of missing parameters", async() => {
    const res = await request(server.app)
      .get("/goals/?idsss=eq06XtykrqSHJtqWblOYkhWat6s2")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send();

    expect(res.statusCode).toEqual(400);
  })

  it("should successfully get short term goals", async() => {
    const res = await request(server.app)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2&dayOfWeek=mon")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send();

    expect(res.statusCode).toEqual(200);
  })

  it("should fail to get short term goals because of missing parameters", async() => {
    const res = await request(server.app)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send();

    expect(res.statusCode).toEqual(400);
  })

  it("should fail to get short term goals because of missing parameters", async() => {
    const res = await request(server.app)
      .get("/goals/shortterm?id=eq06XtykrqSHJtqWblOYkhWat6s2&dayOfWeek=modn")
      .set({ Authorization: "Bearer ExampleAuth"})
      .send();

    expect(res.statusCode).toEqual(500);
  })
})
