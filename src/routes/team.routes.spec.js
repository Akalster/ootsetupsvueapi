const chai = require("chai");
const expect = chai.expect;
const jwt = require("jsonwebtoken");

const requester = require("../../requester.spec");

const User = require("../models/user.model")();
const Team = require("../models/team.model")();

describe("Team routes tests", async function () {
  var token = undefined;
  var team = undefined;

  beforeEach(async function () {
    await requester.post("/api/register").send({
      firstname: "Test",
      lastname: "Tester",
      team: "Oranje",
      email: "test@test.nl",
      password: "secret",
    });

    const userresult = await requester.post("/api/login").send({
      email: "test@test.nl",
      password: "secret",
    });

    token = userresult.body.token;

    var response = await requester
      .post("/api/team")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        name: "testName",
      });

    team = response.body;
  });

  it("POST to /team should create a team", async function () {
    const testTeam = {
      name: "testTeam",
    };

    var response = await requester
      .post("/api/team")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(testTeam);

    expect(response).to.have.status(201);

    var teamInDb = await Team.findById({ _id: response.body._id });

    expect(teamInDb).to.have.property("name", testTeam.name);
    expect(teamInDb).to.have.property("description", testTeam.description);
  });

  it("Get to /team should return all teams", async function () {
    const response = await requester
      .get("/api/team")
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(response).to.have.status(200);
    expect(response.body[0]).to.have.property("name", team.name);
  });

  it("Get to /team/:id should return specific team", async function () {
    const response = await requester
      .get("/api/team/" + team._id)
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(response).to.have.status(200);
    expect(response.body).to.have.property("name", team.name);
    expect(response.body).to.have.property("_id", team._id);
  });

  it("Put to /team/:id should update the team", async function () {
    const updatedTeam = {
      name: "updatedName",
    };

    const response = await requester
      .put("/api/team/" + team._id)
      .set({ Authorization: `Bearer ${token}` })
      .send(updatedTeam);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property("name", updatedTeam.name);
  });

  it("Delete to /team/:id should delete the team", async function () {
    const response = await requester
      .delete("/api/team/" + team._id)
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(response).to.have.status(204);
  });

  it("PUT to /addUser should add an user to the team", async function () {
    var user = jwt.decode(token);

    var body = {
      userId: user.id,
      teamId: team._id,
    };

    const response = await requester
      .put("/api/team/addUser")
      .set({ Authorization: `Bearer ${token}` })
      .send(body);

    expect(response).to.have.status(200);
    expect(response.body.users).to.have.length(1);
    expect(response.body.users[0]).to.have.property("_id", user.id);
  });

  it("PUT to /removeUser should remove an user from the team", async function () {
    var user = jwt.decode(token);

    var body = {
      userId: user.id,
      teamId: team._id,
    };

    await requester
      .put("/api/team/addUser")
      .set({ Authorization: `Bearer ${token}` })
      .send(body);

    const response = await requester
      .put("/api/team/removeUser")
      .set({ Authorization: `Bearer ${token}` })
      .send(body);

    expect(response).to.have.status(200);
    expect(response.body.users).to.have.length(0)
  });
});
