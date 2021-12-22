const chai = require('chai')
const expect = chai.expect

var chaiAsPromised = require("chai-as-promised");
const { beforeEach } = require('mocha');
const { Connection } = require('mongoose');
chai.use(chaiAsPromised);

const requester = require('../../requester.spec')
const Question = require('../routes/question.routes') // note we need to call the model caching function
const Review = require('../routes/review.routes') // required for the reviewkey of question 
const User = require('../routes/user.routes') // required for the bearer token to make requests

describe('question routes', function() {
    describe('unit tests', function() {
        it('(POST /question/:reviewid) should post a question', async function() {
            await requester.post("/api/register").send({
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl", 
                password: "secret"
            });

            const userresult = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            })

            const jwt = userresult.body.token;

            const reviewresult = await requester.post("/api/review").set({ Authorization: `Bearer ${jwt}` }).send({
                createdBy: userresult.body._id,
                title: "TestReview",
                open: true,
                postdate: "2012-08-23T18:25:43.511Z"
            });

            const reviewid = reviewresult.body._id;

            const testQuestion = {
                reviewkey: reviewid,
                type: "Open",
                createdBy: userresult.body._id
            }

            const res = await requester.post('/api/question/' + reviewid).set({ Authorization: `Bearer ${jwt}` }).send(testQuestion)
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')

            const question = await Question.findOne({_id: res.body._id})
            expect(question).to.have.property('reviewkey', testQuestion.reviewkey)
            expect(question).to.have.property('type', testQuestion.type)
            expect(question).to.have.property('createdBy', testQuestion.createdBy)

        })
    })
})