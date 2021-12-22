const chai = require('chai')
const expect = chai.expect

var chaiAsPromised = require("chai-as-promised");
const { beforeEach } = require('mocha');
const { Connection } = require('mongoose');
chai.use(chaiAsPromised);

const requester = require('../../requester.spec')
const Question = require('../models/question.model')() // note we need to call the model caching function
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
                title: "TestReview",
                open: true,
            });

            const reviewid = reviewresult.body.id;

            const testQuestion = {
                type: "Open",
                content: "Diego's vraag"
            }

            const res = await requester.post('/api/review/' + reviewid + "/question").set({ Authorization: `Bearer ${jwt}` }).send(testQuestion)
            console.log(res.body)
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')

            const question = await Question.findOne({_id: res.body._id})
    

            expect(question).to.have.property('type', testQuestion.type)
            expect(question).to.have.property('content', testQuestion.content)

        })
    })
})