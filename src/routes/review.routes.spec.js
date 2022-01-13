const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const User = require('../models/user.model')()
const Review = require('../models/review.model')() // note we need to call the model caching function

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

describe('review endpoints', function() {
    describe('integration tests', function() {
        it('(POST /review/) should post a review', async function() {
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

            const testReview = {
                title: "TestReview",
                open: true,
            }
            const review = await requester.post("/api/review").set({ Authorization: `Bearer ${jwt}` }).send(testReview);

            
            expect(review).to.have.status(201)
            expect(review.body).to.have.property('title', testReview.title)
            expect(review.body).to.have.property('open', testReview.open)

            const reviewInDb = await Review.findById({_id: review.body._id}); 

            expect(reviewInDb).to.have.property('title', testReview.title)
            expect(reviewInDb).to.have.property('open', testReview.open)
        })

        it('(POST /review/) should not post a review without title', async function() {
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

            const testReview = {
              
                open: true,
            }
            const review = await requester.post("/api/review").set({ Authorization: `Bearer ${jwt}` }).send(testReview);

            
            expect(review).to.have.status(400)
        })

        it('(POST /review/) should not post a review without open', async function() {
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

            const testReview = {
                title: "TestReview",
            }
            const review = await requester.post("/api/review").set({ Authorization: `Bearer ${jwt}` }).send(testReview);

            
            expect(review).to.have.status(400)
       
        })
        

        it('(PUT /review/) should update a review', async function() {
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

            const testReview = {
                title: "TestReview",
                open: true,
            }
            const review = await requester.post("/api/review").set({ Authorization: `Bearer ${jwt}` }).send(testReview);

            
            expect(review).to.have.status(201)
            expect(review.body).to.have.property('title', testReview.title)
            expect(review.body).to.have.property('open', testReview.open)

            const updateTestReview = {
                title: "TestReview",
                open: true,
            }

            const reviewUpdate = await requester.put(`/api/review/${review.body._id}`).set({ Authorization: `Bearer ${jwt}` }).send(updateTestReview);
            expect(reviewUpdate).to.have.status(204)

            const reviewInDb = await Review.findById({_id: review.body._id}); 

            expect(reviewInDb).to.have.property('title', updateTestReview.title)
            expect(reviewInDb).to.have.property('open', updateTestReview.open)
        })

        it('(PUT /review/) should not update a review of differnt user', async function() {
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

            const testReview = {
                title: "TestReview",
                open: true,
            }
            const review = await requester.post("/api/review").set({ Authorization: `Bearer ${jwt}` }).send(testReview);

            
            expect(review).to.have.status(201)
            expect(review.body).to.have.property('title', testReview.title)
            expect(review.body).to.have.property('open', testReview.open)

            const updateTestReview = {
                title: "TestReview",
                open: true,
            }

            const reviewUpdate = await requester.put(`/api/review/${review.body._id}`).set({ Authorization: `Bearer ${jwt2}` }).send(updateTestReview);
            expect(reviewUpdate).to.have.status(401)
            expect(reviewUpdate.body).to.have.property('message', "Not authorized!")
        })

        it('(DELETE /review/) should delete a review', async function() {
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

            const testReview = {
                title: "TestReview",
                open: true,
            }
            const review = await requester.post("/api/review").set({ Authorization: `Bearer ${jwt}` }).send(testReview);

            
            expect(review).to.have.status(201)
            expect(review.body).to.have.property('title', testReview.title)
            expect(review.body).to.have.property('open', testReview.open)

            

            const reviewUpdate = await requester.delete(`/api/review/${review.body._id}`).set({ Authorization: `Bearer ${jwt}` }).send();
            expect(reviewUpdate).to.have.status(204)
            
            const docCount = await Review.find().countDocuments()
            expect(docCount).to.equal(0)
        })

        it('(DELETE /review/) should not delete a review of other user', async function() {
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

            const testReview = {
                title: "TestReview",
                open: true,
            }
            const review = await requester.post("/api/review").set({ Authorization: `Bearer ${jwt}` }).send(testReview);

            
            expect(review).to.have.status(201)
            expect(review.body).to.have.property('title', testReview.title)
            expect(review.body).to.have.property('open', testReview.open)

            

            const reviewUpdate = await requester.delete(`/api/review/${review.body._id}`).set({ Authorization: `Bearer ${jwt2}` }).send();
        
            expect(reviewUpdate).to.have.status(401)
            expect(reviewUpdate.body).to.have.property('message', "Not authorized!")
        })
    })
})