//Dit is de route test
//Dit is de route test
//Dit is de route test
//Dit is de route test
//Dit is de route test
//Dit is de route test
//Dit is de route test
//Dit is de route test
//Dit is de route test
//Dit is de route test
//Dit is de route test
//Dit is de route test
//Dit is de route test
//Dit is de route test
//Dit is de route test
//Dit is de route test

// const chai = require('chai')
// const expect = chai.expect

// var chaiAsPromised = require("chai-as-promised");
// const { beforeEach } = require('mocha');
// chai.use(chaiAsPromised);

// const requester = require('../../requester.spec')
// const Question = require('./question.model')() // note we need to call the model caching function
// const Review = require('./review.model')() // required for the reviewkey of question 
// const User = require('./user.model') // required for the bearer token to make requests

// describe('question model', function() {
//     describe('unit tests', function() {
//         beforeEach(function() {
//             db.clear(function(err) {
//                 if (err) return done(err);
//             })

//             await requester.post("/api/register").send({
//                 firstname: "Test",
//                 lastname: "Tester", 
//                 team: "Oranje", 
//                 email: "test@test.nl", 
//                 password: "secret"
//             });

//             const userresult = await requester.post("/api/login").send({
//                 email: "test@test.nl",
//                 password: "secret"
//             })

//             const token = userresult.body.token;

//             await requester.post("/api/review").send({
//                 createdBy: userresult.body._id,
//                 title: "TestReview",
//                 open: true,
//                 postdate: "2012-08-23T18:25:43.511Z"
//             });

//             const reviewresult = await requester.post("/api/review").send({

//             })

//             const testReview = {

//             }
//         })
//     })
// })