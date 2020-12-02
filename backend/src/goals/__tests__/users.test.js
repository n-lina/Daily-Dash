const request = require("supertest");
const server = require("../../index");
const logger = require("../../logger/logging");
const HCGoalsModule = require("../goalsHardcoded");
HCGoalsModule.addHCGoals();

describe("Users integration tests", () => {
  afterAll(async () => {
    await server.shutdown();
  });

  beforeEach(() => {
    logger.transports.forEach((t) => (t.silent = true));
    jest.useFakeTimers();
    jest.runAllTimers();
    jest.setTimeout(30000);
  });

  it("should successfully add user", async (done) => {
    await request(server)
      .post("/users")
      .set({ Authorization: "Bearer test" })
      .send({
        id: "testid123",
        email: "sdff2@gmail.com",
        username: "Ponyboy",
        notificationId: ""
      })
      .expect(200);

    done();
  });

  it("should fail to add user since missing param", async (done) => {
    await request(server)
      .post("/users")
      .set({ Authorization: "Bearer test" })
      .send({
        id: "testid123",
        username: "Ponyboy",
        notificationId: ""
      })
      .expect(400);

    done();
  });

  it("should get user ", async (done) => {
    await request(server)
      .get("/users/testid123")
      .set({ Authorization: "Bearer test" })
      .send()
      .expect(200);

    done();
  });

  it("should fail to get user because does not exist", async (done) => {
    await request(server)
      .get("/users/doesntexistthisuser")
      .set({ Authorization: "Bearer test" })
      .send()
      .expect(400);

    done();
  });

  // FAILING BECAUSE DON'T KNOW HOW TO PASS NULL PARAMS HERE
  it("should fail to get user because missing parameters", async (done) => {
    await request(server)
      .get("/users/")
      .set({ Authorization: "Bearer test" })
      .send()
      .expect(400);

    done();
  });

  it("should fail to update user time since missing param", async (done) => {
    await request(server)
      .put("/users/time/testid123")
      .set({ Authorization: "Bearer test" })
      .send()
      .expect(400);

    done();
  });

  //DON'T KNOW WHAT TO PUT FOR "timemode"
  it("should update user time", async (done) => {
    await request(server)
      .put("/users/time/testid123")
      .set({ Authorization: "Bearer test" })
      .send({ timemode: "WHAT GOES HERE?" })
      .expect(200);

    done();
  });

  //DON'T KNOW HOW THIS ENDPOINT WORKS re: what is token?
  it("should expire notification token", async (done) => {
    await request(server)
      .delete("/users/testid123/notification/?token=WHATGOESHERE")
      .set({ Authorization: "Bearer test" })
      .send()
      .expect(400);

    done();
  });
});
