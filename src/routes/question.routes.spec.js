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

            const reviewid = reviewresult.body._id;

            const testQuestion = {
                type: "Open",
                content: "Diego's vraag"
            }

            const res = await requester.post('/api/review/' + reviewid + "/question").set({ Authorization: `Bearer ${jwt}` }).send(testQuestion)
           
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')

            const question = await Question.findOne({_id: res.body._id})
    

            expect(question).to.have.property('type', testQuestion.type)
            expect(question).to.have.property('content', testQuestion.content)

        })

        it('(PUT /question/:reviewid/question/:questionId) should update a question', async function() {
            await requester.post("/api/register").send({
                firstname: "Test",
                lastname: "Tester",
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

            const reviewid = reviewresult.body._id;

            const testQuestion = {
                type: "Open",
                content: "Diego's vraag"
            }

            const updateQuestion = {
                type: "Scale",
                content: "Jamie's vraag"
            }

            const res = await requester.post('/api/review/' + reviewid + "/question").set({ Authorization: `Bearer ${jwt}` }).send(testQuestion)
           
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')

            const questionId = res.body._id; 

            
            
            const updateres = await requester.put(`/api/review/${reviewid}/question/${questionId}`).set({ Authorization: `Bearer ${jwt}` }).send(updateQuestion)
            expect(updateres).to.have.status(204)

            const question = await Question.findOne({_id: res.body._id})
            expect(question).to.have.property('type', updateQuestion.type)
            expect(question).to.have.property('content', updateQuestion.content)

        })

        it('(DELETE /question/:reviewid/question/:questionId) should delete a question', async function() {
            await requester.post("/api/register").send({
                firstname: "Test",
                lastname: "Tester",
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

            const reviewid = reviewresult.body._id;

            const testQuestion = {
                type: "Open",
                content: "Diego's vraag"
            }

            const res = await requester.post('/api/review/' + reviewid + "/question").set({ Authorization: `Bearer ${jwt}` }).send(testQuestion)
           
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')

            const questionId = res.body._id; 

            const updateres = await requester.delete(`/api/review/${reviewid}/question/${questionId}`).set({ Authorization: `Bearer ${jwt}` }).send()
            expect(updateres).to.have.status(204)

            const docCount = await Question.find().countDocuments()
            expect(docCount).to.equal(0)

        })

        it('(DELETE /question/:reviewid/question/:questionId) should not delete a question of other user', async function() {
            await requester.post("/api/register").send({
                firstname: "Test",
                lastname: "Tester",
                email: "test@test.nl", 
                password: "secret"
            });

            const userresult = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            })

            const jwt = userresult.body.token;

            await requester.post("/api/register").send({
                firstname: "Iemand",
                lastname: "Anders",
                email: "iemand@test.nl", 
                password: "secret"
            });

            const userresult2 = await requester.post("/api/login").send({
                email: "iemand@test.nl",
                password: "secret"
            })

            const jwt2 = userresult2.body.token;

            const reviewresult = await requester.post("/api/review").set({ Authorization: `Bearer ${jwt}` }).send({
                title: "TestReview",
                open: true,
            });

            const reviewid = reviewresult.body._id;

            const testQuestion = {
                type: "Open",
                content: "Diego's vraag"
            }

            const res = await requester.post('/api/review/' + reviewid + "/question").set({ Authorization: `Bearer ${jwt}` }).send(testQuestion)
           
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')

            const questionId = res.body._id; 

            const updateres = await requester.delete(`/api/review/${reviewid}/question/${questionId}`).set({ Authorization: `Bearer ${jwt2}` }).send()

            expect(updateres).to.have.status(401)
            expect(updateres.body).to.have.property('message', "Not authorized!")
        })
    })
})