const chai = require("chai");
const expect = chai.expect;

const requester = require("../../requester.spec");

const User = require("../models/user.model")();
const Review = require("../models/review.model")(); // note we need to call the model caching function
const Question = require("../models/question.model")();

const OpenAnswer = require("../models/openAnswer.model")();
const MultiAnswer = require("../models/multipileChoiceAnswer.model")();
const ScaleAnswer = require("../models/scaleAnswer.model")();
const PercentageAnswer = require("../models/percentageAnswer.model")();

async function createUser() {
  await requester.post("/api/register").send({
    firstname: "Test",
    lastname: "Tester",

    email: "test@test.nl",
    password: "secret"
  });

  const result = await requester.post("/api/login").send({
    email: "test@test.nl",
    password: "secret"
  });

  return result.body.token;
}

describe("answer endpoints", function() {
  describe("integration tests", function() {
    it("(post /question/questionId/answer/open) should post open answer", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "open",
        content: "Diego's vraag"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Jamie's antwoord"
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/open`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);
      expect(answerRes).to.have.status(201);

      const answer = await OpenAnswer.findOne({ _id: answerRes.body._id });

      expect(answer).to.have.property("content", testAnswer.content);
    });

    it("(put /question/questionId/answer/open) should update open answer", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "open",
        content: "Diego's vraag"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Jamie's antwoord"
      };

      const updatedAnswer = {
        content: "Rowan's antwoord"
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/open`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);
      expect(answerRes).to.have.status(201);

      const answer = await OpenAnswer.findOne({ _id: answerRes.body._id });

      const UpdateRes = await requester
        .put(`/api/answer/question/${questionId}/open/${answer._id}`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(updatedAnswer);
      expect(UpdateRes).to.have.status(204);

      const upAnswer = await OpenAnswer.findOne({ _id: answerRes.body._id });
      expect(upAnswer).to.have.property("content", updatedAnswer.content);
    });

    it("(put /question/questionId/answer/open) should update open answer of other user", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "tester@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const userresult2 = await requester.post("/api/login").send({
        email: "tester@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const jwt2 = userresult2.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "open",
        content: "Diego's vraag"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Jamie's antwoord"
      };

      const updatedAnswer = {
        content: "Rowan's antwoord"
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/open`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);
      expect(answerRes).to.have.status(201);

      const answer = await OpenAnswer.findOne({ _id: answerRes.body._id });

      const UpdateRes = await requester
        .put(`/api/answer/question/${questionId}/open/${answer._id}`)
        .set({ Authorization: `Bearer ${jwt2}` })
        .send(updatedAnswer);
      expect(UpdateRes).to.have.status(401);

      const upAnswer = await OpenAnswer.findOne({ _id: answerRes.body._id });
      expect(upAnswer).to.have.property("content", testAnswer.content);
    });

    it("(delete /question/questionId/answer/open/answerid) should delete open answer", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "open",
        content: "Diego's vraag"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Jamie's antwoord"
      };

      const updatedAnswer = {
        content: "Rowan's antwoord"
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/open`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);
      expect(answerRes).to.have.status(201);

      const answer = await OpenAnswer.findOne({ _id: answerRes.body._id });

      const UpdateRes = await requester
        .delete(`/api/answer/question/${questionId}/open/${answer._id}`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(updatedAnswer);
      expect(UpdateRes).to.have.status(204);

      const upAnswer = await OpenAnswer.find().countDocuments();
      expect(upAnswer).to.equal(0);
    });

    it("(delete /question/questionId/answer/open/answerid) should not delete open answer of other user", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "tester@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const userresult2 = await requester.post("/api/login").send({
        email: "tester@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const jwt2 = userresult2.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "open",
        content: "Diego's vraag"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Jamie's antwoord"
      };

      const updatedAnswer = {
        content: "Rowan's antwoord"
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/open`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);
      expect(answerRes).to.have.status(201);

      const answer = await OpenAnswer.findOne({ _id: answerRes.body._id });

      const UpdateRes = await requester
        .delete(`/api/answer/question/${questionId}/open/${answer._id}`)
        .set({ Authorization: `Bearer ${jwt2}` })
        .send();
      expect(UpdateRes).to.have.status(401);

      const upAnswer = await OpenAnswer.find().countDocuments();
      expect(upAnswer).to.equal(1);
    });

    it("(post /question/questionId/answer/multi) should post multi answer", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "multi",
        content: "Diego's vraag",
        option1: "Kaas",
        option2: "Boter",
        option3: "Eiren"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Eiren hmmm lekker",
        selectedChoice: "Eiren"
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/multi`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);

      expect(answerRes).to.have.status(201);

      const answer = await MultiAnswer.findOne({ _id: answerRes.body._id });
      expect(answer).to.have.property("content", testAnswer.content);
      expect(answer).to.have.property(
        "selectedChoice",
        testAnswer.selectedChoice
      );
    });

    it("(put /question/questionId/answer/multi) should update multi answer", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "multi",
        content: "Diego's vraag",
        option1: "Kaas",
        option2: "Boter",
        option3: "Eiren"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Eiren hmmm lekker",
        selectedChoice: "Eiren"
      };

      const updatedAnswer = {
        content: "Rowan's antwoord",
        selectedChoice: "Boter"
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/multi`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);
      expect(answerRes).to.have.status(201);

      const answer = await MultiAnswer.findOne({ _id: answerRes.body._id });

      const UpdateRes = await requester
        .put(`/api/answer/question/${questionId}/multi/${answer._id}`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(updatedAnswer);
      expect(UpdateRes).to.have.status(204);

      const upAnswer = await MultiAnswer.findOne({ _id: answerRes.body._id });
      expect(upAnswer).to.have.property("content", updatedAnswer.content);
      expect(upAnswer).to.have.property(
        "selectedChoice",
        updatedAnswer.selectedChoice
      );
    });

    it("(put /question/questionId/answer/multi) should not update multi answer of other user", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "tester@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const userresult2 = await requester.post("/api/login").send({
        email: "tester@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const jwt2 = userresult2.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "multi",
        content: "Diego's vraag",
        option1: "Kaas",
        option2: "Boter",
        option3: "Eiren"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Eiren hmmm lekker",
        selectedChoice: "Eiren"
      };

      const updatedAnswer = {
        content: "Rowan's antwoord",
        selectedChoice: "Boter"
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/multi`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);
      expect(answerRes).to.have.status(201);

      const answer = await MultiAnswer.findOne({ _id: answerRes.body._id });

      const UpdateRes = await requester
        .put(`/api/answer/question/${questionId}/multi/${answer._id}`)
        .set({ Authorization: `Bearer ${jwt2}` })
        .send(updatedAnswer);
      expect(UpdateRes).to.have.status(401);

      const upAnswer = await MultiAnswer.findOne({ _id: answerRes.body._id });
      expect(upAnswer).to.have.property("content", testAnswer.content);
      expect(upAnswer).to.have.property(
        "selectedChoice",
        testAnswer.selectedChoice
      );
    });

    it("(delete /question/questionId/answer/multi) should delete multi answer", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",
        email: "test@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "multi",
        content: "Diego's vraag",
        option1: "Kaas",
        option2: "Boter",
        option3: "Eiren"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Eiren hmmm lekker",
        selectedChoice: "Eiren"
      };

      const updatedAnswer = {
        content: "Rowan's antwoord",
        selectedChoice: "Boter"
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/multi`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);
      expect(answerRes).to.have.status(201);

      const answer = await MultiAnswer.findOne({ _id: answerRes.body._id });

      const UpdateRes = await requester
        .delete(`/api/answer/question/${questionId}/multi/${answer._id}`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send();
      expect(UpdateRes).to.have.status(204);

      const upAnswer = await MultiAnswer.find().countDocuments();
      expect(upAnswer).to.equal(0);
    });

    it("(delete /question/questionId/answer/multi) should not delete multi answer of other user", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "tester@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const userresult2 = await requester.post("/api/login").send({
        email: "tester@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const jwt2 = userresult2.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "multi",
        content: "Diego's vraag",
        option1: "Kaas",
        option2: "Boter",
        option3: "Eiren"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Eiren hmmm lekker",
        selectedChoice: "Eiren"
      };

      const updatedAnswer = {
        content: "Rowan's antwoord",
        selectedChoice: "Boter"
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/multi`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);
      expect(answerRes).to.have.status(201);

      const answer = await MultiAnswer.findOne({ _id: answerRes.body._id });

      const UpdateRes = await requester
        .delete(`/api/answer/question/${questionId}/multi/${answer._id}`)
        .set({ Authorization: `Bearer ${jwt2}` })
        .send();
      expect(UpdateRes).to.have.status(401);

      const upAnswer = await MultiAnswer.find().countDocuments();
      expect(upAnswer).to.equal(1);
    });

    it("(post /question/questionId/answer/scale) should post scale answer", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "multi",
        content: "Diego's vraag",
        option1: "Kaas",
        option2: "Boter",
        option3: "Eiren"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Eiren hmmm lekker",
        selectedScale: "Eiren"
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/scale`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);

      expect(answerRes).to.have.status(201);

      const answer = await ScaleAnswer.findOne({ _id: answerRes.body._id });

      expect(answer).to.have.property("content", testAnswer.content);
      expect(answer).to.have.property(
        "selectedScale",
        testAnswer.selectedScale
      );
    });

    it("(put /question/questionId/answer/scale) should update scale answer", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "multi",
        content: "Diego's vraag",
        option1: "Kaas",
        option2: "Boter",
        option3: "Eiren"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Eiren hmmm lekker",
        selectedScale: "Eiren"
      };

      const updatedAnswer = {
        content: "Rowan's antwoord",
        selectedScale: "Boter"
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/scale`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);
      expect(answerRes).to.have.status(201);

      const answer = await ScaleAnswer.findOne({ _id: answerRes.body._id });

      const UpdateRes = await requester
        .put(`/api/answer/question/${questionId}/scale/${answer._id}`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(updatedAnswer);
      expect(UpdateRes).to.have.status(204);

      const upAnswer = await ScaleAnswer.findOne({ _id: answerRes.body._id });
      expect(upAnswer).to.have.property("content", updatedAnswer.content);
      expect(upAnswer).to.have.property(
        "selectedScale",
        updatedAnswer.selectedScale
      );
    });

    it("(put /question/questionId/answer/scale) should not update scale answer of ohter user", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "tester@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const userresult2 = await requester.post("/api/login").send({
        email: "tester@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const jwt2 = userresult2.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "multi",
        content: "Diego's vraag",
        option1: "Kaas",
        option2: "Boter",
        option3: "Eiren"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Eiren hmmm lekker",
        selectedScale: "Eiren"
      };

      const updatedAnswer = {
        content: "Rowan's antwoord",
        selectedScale: "Boter"
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/scale`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);
      expect(answerRes).to.have.status(201);

      const answer = await ScaleAnswer.findOne({ _id: answerRes.body._id });

      const UpdateRes = await requester
        .put(`/api/answer/question/${questionId}/scale/${answer._id}`)
        .set({ Authorization: `Bearer ${jwt2}` })
        .send(updatedAnswer);
      expect(UpdateRes).to.have.status(401);

      const upAnswer = await ScaleAnswer.findOne({ _id: answerRes.body._id });
      expect(upAnswer).to.have.property("content", testAnswer.content);
      expect(upAnswer).to.have.property(
        "selectedScale",
        testAnswer.selectedScale
      );
    });

    it("(delete /question/questionId/answer/scale) should delete scale answer", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "multi",
        content: "Diego's vraag",
        option1: "Kaas",
        option2: "Boter",
        option3: "Eiren"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Eiren hmmm lekker",
        selectedScale: "Eiren"
      };

      const updatedAnswer = {
        content: "Rowan's antwoord",
        selectedScale: "Boter"
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/scale`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);
      expect(answerRes).to.have.status(201);

      const answer = await ScaleAnswer.findOne({ _id: answerRes.body._id });

      const UpdateRes = await requester
        .delete(`/api/answer/question/${questionId}/scale/${answer._id}`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(updatedAnswer);
      expect(UpdateRes).to.have.status(204);

      const upAnswer = await ScaleAnswer.find().countDocuments();
      expect(upAnswer).to.equal(0);
    });

    it("(delete /question/questionId/answer/scale) should not delete scale answer of other user", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "tester@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const userresult2 = await requester.post("/api/login").send({
        email: "tester@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const jwt2 = userresult2.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "multi",
        content: "Diego's vraag",
        option1: "Kaas",
        option2: "Boter",
        option3: "Eiren"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Eiren hmmm lekker",
        selectedScale: "Eiren"
      };

      const updatedAnswer = {
        content: "Rowan's antwoord",
        selectedScale: "Boter"
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/scale`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);
      expect(answerRes).to.have.status(201);

      const answer = await ScaleAnswer.findOne({ _id: answerRes.body._id });

      const UpdateRes = await requester
        .delete(`/api/answer/question/${questionId}/scale/${answer._id}`)
        .set({ Authorization: `Bearer ${jwt2}` })
        .send(updatedAnswer);
      expect(UpdateRes).to.have.status(401);

      const upAnswer = await ScaleAnswer.find().countDocuments();
      expect(upAnswer).to.equal(1);
    });

    it("(post /question/questionId/answer/percentage) should post percentage answer", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "percentage",
        content: "Diego's vraag"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Eiren hmmm lekker",
        percentage: 80
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/percentage`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);

      expect(answerRes).to.have.status(201);

      const answer = await PercentageAnswer.findOne({
        _id: answerRes.body._id
      });

      expect(answer).to.have.property("content", testAnswer.content);
      expect(answer).to.have.property("percentage", testAnswer.percentage);
    });

    it("(put /question/questionId/answer/percentage) should update percentage answer", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "percentage",
        content: "Diego's vraag"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Eiren hmmm lekker",
        percentage: 80
      };

      const updatedAnswer = {
        content: "Rowan's antwoord",
        percentage: 70
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/percentage`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);
      expect(answerRes).to.have.status(201);

      const answer = await PercentageAnswer.findOne({
        _id: answerRes.body._id
      });

      const UpdateRes = await requester
        .put(`/api/answer/question/${questionId}/percentage/${answer._id}`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(updatedAnswer);
      expect(UpdateRes).to.have.status(204);

      const upAnswer = await PercentageAnswer.findOne({
        _id: answerRes.body._id
      });
      expect(upAnswer).to.have.property("content", updatedAnswer.content);
      expect(upAnswer).to.have.property("percentage", updatedAnswer.percentage);
    });

    it("(put /question/questionId/answer/percentage) should not update percentage answer of other user", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "tester@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const userresult2 = await requester.post("/api/login").send({
        email: "tester@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const jwt2 = userresult2.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "percentage",
        content: "Diego's vraag"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Eiren hmmm lekker",
        percentage: 80
      };

      const updatedAnswer = {
        content: "Rowan's antwoord",
        percentage: 70
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/percentage`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);
      expect(answerRes).to.have.status(201);

      const answer = await PercentageAnswer.findOne({
        _id: answerRes.body._id
      });

      const UpdateRes = await requester
        .put(`/api/answer/question/${questionId}/percentage/${answer._id}`)
        .set({ Authorization: `Bearer ${jwt2}` })
        .send(updatedAnswer);
      expect(UpdateRes).to.have.status(401);

      const upAnswer = await PercentageAnswer.findOne({
        _id: answerRes.body._id
      });
      expect(upAnswer).to.have.property("content", testAnswer.content);
      expect(upAnswer).to.have.property("percentage", testAnswer.percentage);
    });

    it("(delete /question/questionId/answer/percentage) should delete percentage answer", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "percentage",
        content: "Diego's vraag"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Eiren hmmm lekker",
        percentage: 80
      };

      const updatedAnswer = {
        content: "Rowan's antwoord",
        percentage: 70
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/percentage`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);
      expect(answerRes).to.have.status(201);

      const answer = await PercentageAnswer.findOne({
        _id: answerRes.body._id
      });

      const UpdateRes = await requester
        .delete(`/api/answer/question/${questionId}/percentage/${answer._id}`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send();
      expect(UpdateRes).to.have.status(204);

      const upAnswer = await PercentageAnswer.find().countDocuments();
      expect(upAnswer).to.equal(0);
    });

    it("(delete /question/questionId/answer/percentage) should not delete percentage answer of other user", async function() {
      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "test@test.nl",
        password: "secret"
      });

      await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",

        email: "tester@test.nl",
        password: "secret"
      });

      const userresult = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
      });

      const userresult2 = await requester.post("/api/login").send({
        email: "tester@test.nl",
        password: "secret"
      });

      const jwt = userresult.body.token;

      const jwt2 = userresult2.body.token;

      const reviewresult = await requester
        .post("/api/review")
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          title: "TestReview",
          open: true
        });

      const reviewid = reviewresult.body._id;

      const testQuestion = {
        type: "percentage",
        content: "Diego's vraag"
      };

      const res = await requester
        .post("/api/review/" + reviewid + "/question")
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testQuestion);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");

      const questionId = res.body._id;

      const testAnswer = {
        content: "Eiren hmmm lekker",
        percentage: 80
      };

      const updatedAnswer = {
        content: "Rowan's antwoord",
        percentage: 70
      };

      const answerRes = await requester
        .post(`/api/answer/question/${questionId}/percentage`)
        .set({ Authorization: `Bearer ${jwt}` })
        .send(testAnswer);
      expect(answerRes).to.have.status(201);

      const answer = await PercentageAnswer.findOne({
        _id: answerRes.body._id
      });

      const UpdateRes = await requester
        .delete(`/api/answer/question/${questionId}/percentage/${answer._id}`)
        .set({ Authorization: `Bearer ${jwt2}` })
        .send();
      expect(UpdateRes).to.have.status(401);

      const upAnswer = await PercentageAnswer.find().countDocuments();
      expect(upAnswer).to.equal(1);
    });
  });
});
