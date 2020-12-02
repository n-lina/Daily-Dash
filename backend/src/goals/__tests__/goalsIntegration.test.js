const request = require('supertest');
const server = require('../../index');
const logger = require("../../logger/logging");
const HCGoalsModule = require("../goalsHardcoded");
const goalsHelper = require('../goalsHelper');
HCGoalsModule.addHCGoals();

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

  beforeAll(() => {
    HCGoalsModule.addHCGoals();
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

  it("should successfully add an LTG", async(done) => { 
    await request(server)
      .post("/goals")
      .set({ Authorization: "Bearer test"})
      .send({"userId":"testUser100","title":"Become great.",
      "description":"irrelevant words",
      "shortTermGoals":[
        {"title":"Do a cool thing.","mon":[5,15],"wed":[30,20]},
        {"title":"Every week, hi 5 someone.","sat":[5,15],"sun":[30,20]}]})
      .expect(200);

    done();
  })
 
  test("should successfully get suggested STG title", async(done) => {
    const res = await request(server)
      .get("/goals/suggestedstg?title=guitar%20finger")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)
          
    expect(res.body.answer).toEqual("Do finger training with the finger pump machine thingy.");

    done();
  })

  test("should get error for failing to include valid suggestedstg query parameter", async(done) => {
    await request(server)
      .get("/goals/suggestedstg")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(400)
          
    done();
  })

  test("should delete a goal", async(done) => {
    await request(server)
      .delete("/goals/5fc6ae0fa16da33aecc5e0fd")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)
          
    done();
  })

  test("should fail to delete a goal that doesn't exist, but still get 200", async(done) => {
    await request(server)
      .delete("/goals/fakeid123")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(200)
          
    done();
  })

  test("should send no param value and receive 404", async(done) => {
    await request(server)
      .delete("/goals")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(404)
          
    done();
  })
  

  test("should update goal and receive 200", async(done) => {
    await request(server)
      .put("/goals/5fc7e4809eccc4554c9d61d7")
      .set({ Authorization: "Bearer test"})
      .send({"userId":"testUser4","title":"Adopt a  lifestyle",
        "description":"I want to and feel better.",
        "shortTermGoals":[{"title": "Cook  at home", "mon": [100], "tue": [30], "wed": [4] },
        {"title": " 15 minutes", "mon": [100], "tue": [30], "wed": [4] },
        {"title": "Go to sleep early", "mon": [100], "tue": [30], "wed": [4] },
        {"title": "Wake up early", "mon": [100], "tue": [430], "wed": [4] },
        {"title": "Drink more water", "mon": [100], "tue": [30], "wed": [4] },
        {"title": "Eat more fruit and vegetables", "mon": [100], "tue": [30], "wed": [4] },
        {"title": "Buy whole grain and high protein products", "mon": [100], "tue": [30], "wed": [4] }]
  })
      .expect(200)
          
    done();
  })

  test("should send non-existant id parameter and fail to update goal and receive 400", async(done) => {
    await request(server)
      .put("/goals/fakeid123")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(400)
          
    done();
  })

  test("should fail to update goal and receive 400", async(done) => {
    await request(server)
      .put("/goals/fakeid123")
      .set({ Authorization: "Bearer test"})
      .send()
      .expect(400)
          
    done();
  })

  test("should update an STG with +1 for true and receive 200", async(done) => {
    await request(server)
      .put("/goals/shortterm/counter")
      .set({ Authorization: "Bearer test"})
      .send({"userId":"testUser5","shortTermGoalId":"5fc6a54bceb02e32dc523d35","complete":"1"})
      .expect(200)
          
    done();
  })

  test("should update an STG with invalid complete value, trigger errors, and receive 500", async(done) => {
    await request(server)
      .put("/goals/shortterm/counter")
      .set({ Authorization: "Bearer test"})
      .send({"userId":"testUser6","shortTermGoalId":"5fc6a54bceb02e32dc523d3b","complete":false})
      .expect(500)
          
    done();
  })

  test("should fail to update/completing an STG and receive 400", async(done) => {
    await request(server)
      .put("/goals/shortterm/counter")
      .set({ Authorization: "Bearer test"})
      .send({"userId":"testUser5","shortTermGoalId":"5fc6a54bceb02e32dc523d35"}) //parameter must be missing
      .expect(400)
          
    done();
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

  it("should fail to get short term goals because of missing parameters", () => {
    const exampleArray = [
      {
        timesCompleted: 0,
        mon: [ 5, 15 ],
        tue: [],
        wed: [ 30, 20 ],
        thu: [],
        fri: [],
        sat: [],
        sun: [],
        _id: "5fc8031ef44a903575ad2349",
        title: 'Do a coding challenge practice problem each weekday.'
      },
      {
        timesCompleted: 0,
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [ 5, 15 ],
        sun: [ 30, 20 ],
        _id: "5fc8031ef44a903575ad234a",
        title: 'Every week, make a project that helps out mom and dad.'
      },
      {
        timesCompleted: 0,
        mon: [ 5, 15 ],
        tue: [],
        wed: [ 30, 20 ],
        thu: [],
        fri: [],
        sat: [],
        sun: [],
        _id: "5fc8031ef44a903575ad234b",
        title: 'Every Sunday, visit a makerspace and see what people are up to, coding-wise, for inspiration.'
      }
    ]

    goalsHelper.updateShortTermGoalCounter(exampleArray, exampleArray);
  })

})
