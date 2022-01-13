const chai = require('chai')
const expect = chai.expect

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const Question = require('./question.model')(); // note we need to call the model caching function
const Review = require('./review.model')(); // required for the reviewkey of question 
const User = require('./user.model')(); // required for the bearer token to make requests

describe('question model', function () {
    describe('unit tests', function () {
        it('should create a question', async function () {

            const user = await new User({
                firstname: "Test",
                lastname: "Tester",
                email: "test@test.nl", 
                password: "secret"
            });
            
            const review = await new Review({
                createdBy: user._id, 
                title: 'Hoe testerig ben ik?',
                open: true,
            });

            const question = new Question({
                reviewkey: review._id,
                type: "Open",
                content: "Goeie vraag",  
                createdBy: user._id
            });

            await expect(question.save()).to.be.ok;
        });

        it('should reject a missing reviewkey', async function () {

            const user = await new User({
                firstname: "Test",
                lastname: "Tester",
                email: "test@test.nl", 
                password: "secret"
            });

            const testQuestion = {
                type: "Open",
                createdBy: user._id
            };

            const question = new Question(testQuestion);

            await expect(question.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing question type', async function () {
            const user = await new User({
                firstname: "Test",
                lastname: "Tester",
                email: "test@test.nl", 
                password: "secret"
            });

            const review = await new Review({
                createdBy: user._id, 
                title: 'Hoe testerig ben ik?',
                open: true,
            });

            const testQuestion = {
                reviewkey: review._id,
                createdBy: user._id
            };

            const question = new Question(testQuestion);

            await expect(question.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing createdBy', async function () {
            const user = await new User({
                firstname: "Test",
                lastname: "Tester",
                email: "test@test.nl", 
                password: "secret"
            });

            const review = await new Review({
                createdBy: user._id, 
                title: 'Hoe testerig ben ik?',
                open: true,
            });

            const testQuestion = {
                reviewkey: review._id,
                type: "Open"
            };

            const question = new Question(testQuestion);

            await expect(question.save()).to.be.rejectedWith(Error);
        });
    });
});
