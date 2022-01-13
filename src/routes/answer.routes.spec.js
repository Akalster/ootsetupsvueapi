const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const User = require('../models/user.model')()
const Review = require('../models/review.model')() // note we need to call the model caching function
const Question = require("../models/question.model")() 

const OpenAnswer = require("../models/openAnswer.model")()
const MultiAnswer = require("../models/multipileChoiceAnswer.model")()
const ScaleAnswer = require("../models/scaleAnswer.model")()
const PercentageAnswer = require("../models/percentageAnswer.model")()

async function createUser() {
    await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",
        team: "Oranje",
        email: "test@test.nl",
        password: "secret"
    });

    const result = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
    });

    return result.body.token;
}

describe('answer endpoints', function() {
    describe('integration tests', function() {
        it('(post /question/questionId/answer/open) should post open answer', async function() {
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

            const reviewid = reviewresult.body._id;

            const testQuestion = {
                type: "open",
                content: "Diego's vraag"
            }


            const res = await requester.post('/api/review/' + reviewid + "/question").set({ Authorization: `Bearer ${jwt}` }).send(testQuestion)
           
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')

            
            const questionId = res.body._id; 

            const testAnswer = {
                content: "Jamie's antwoord", 
            }

            const answerRes = await requester.post(`/api/answer/question/${questionId}/open`).set({ Authorization: `Bearer ${jwt}` }).send(testAnswer)
            expect(answerRes).to.have.status(201)
            
            const answer = await OpenAnswer.findOne({_id: answerRes.body._id})
        
            expect(answer).to.have.property('content', testAnswer.content)

        })

        it('(post /question/questionId/answer/multi) should post multi answer', async function() {
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

            const reviewid = reviewresult.body._id;

            const testQuestion = {
                type: "multipilechoice",
                content: "Diego's vraag",
                option1: "Kaas", 
                option2: "Boter", 
                option3: "Eiren"
            }


            const res = await requester.post('/api/review/' + reviewid + "/question").set({ Authorization: `Bearer ${jwt}` }).send(testQuestion)
           
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')

            
            const questionId = res.body._id; 


            const testAnswer = {
                content: "Eiren hmmm lekker",
                selectedChoice: "Eiren"
            }

            const answerRes = await requester.post(`/api/answer/question/${questionId}/multi`).set({ Authorization: `Bearer ${jwt}` }).send(testAnswer)

            expect(answerRes).to.have.status(201)
            
            const answer = await MultiAnswer.findOne({_id: answerRes.body._id})
            expect(answer).to.have.property('content', testAnswer.content)
            expect(answer).to.have.property('selectedChoice', testAnswer.selectedChoice)
        })

        it('(post /question/questionId/answer/scale) should post scale answer', async function() {
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

            const reviewid = reviewresult.body._id;

            const testQuestion = {
                type: "multipilechoice",
                content: "Diego's vraag",
                option1: "Kaas", 
                option2: "Boter", 
                option3: "Eiren"
            }


            const res = await requester.post('/api/review/' + reviewid + "/question").set({ Authorization: `Bearer ${jwt}` }).send(testQuestion)
           
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')

            
            const questionId = res.body._id; 


            const testAnswer = {
                content: "Eiren hmmm lekker",
                selectedScale: "Eiren"
            }

            const answerRes = await requester.post(`/api/answer/question/${questionId}/scale`).set({ Authorization: `Bearer ${jwt}` }).send(testAnswer)

            expect(answerRes).to.have.status(201)
            
            const answer = await ScaleAnswer.findOne({_id: answerRes.body._id})

            expect(answer).to.have.property('content', testAnswer.content)
            expect(answer).to.have.property('selectedScale', testAnswer.selectedScale)
        })

        it('(post /question/questionId/answer/percentage) should post percentage answer', async function() {
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

            const reviewid = reviewresult.body._id;

            const testQuestion = {
                type: "percentage",
                content: "Diego's vraag",
            }


            const res = await requester.post('/api/review/' + reviewid + "/question").set({ Authorization: `Bearer ${jwt}` }).send(testQuestion)
           
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')

            
            const questionId = res.body._id; 


            const testAnswer = {
                content: "Eiren hmmm lekker",
                percentage: 80, 
            }

            const answerRes = await requester.post(`/api/answer/question/${questionId}/percentage`).set({ Authorization: `Bearer ${jwt}` }).send(testAnswer)

            expect(answerRes).to.have.status(201)
            
            const answer = await PercentageAnswer.findOne({_id: answerRes.body._id})
      

            expect(answer).to.have.property('content', testAnswer.content)
            expect(answer).to.have.property('percentage', testAnswer.percentage)
        })
    })
})