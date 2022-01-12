const chai = require('chai');
const expect = chai.expect;

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const User = require('./user.model')(); 
const Review = require('./review.model')(); // note we need to call the model caching function
const Question = require("./question.model")(); 
const PercentageQuestion = require("./percentageAnswer.model")(); 

describe('percentage answer model', function () {
    describe('unit tests', function () {
        it('should create an open question', async function () {
            const user = await new User({
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl", 
                password: "secret"
            });
            
            const review = await new Review({
                createdBy: user._id, 
                title: 'Hoe testerig ben ik?',
                open: true,
            });

            const question = await new Question({
                reviewkey: review._id,
                type: "open",
                content: "Goeie vraag",  
                createdBy: user._id
            });

            const percentageQuestion = await new PercentageQuestion({
                content: "Goed antwoord!", 
                percentage: 100, 
                createdBy: user._id, 
                answeredDate: new Date, 
                questionId: question._id, 
            })

            await expect(percentageQuestion.save()).to.be.ok;
        });

        it('should reject a missing answer content', async function () {
            const user = await new User({
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl", 
                password: "secret"
            });
            
            const review = await new Review({
                createdBy: user._id, 
                title: 'Hoe testerig ben ik?',
                open: true,
            });

            const question = await new Question({
                reviewkey: review._id,
                type: "open",
                content: "Goeie vraag",  
                createdBy: user._id
            });

            const percentageQuestion = await new PercentageQuestion({
                percentage: 100, 
                createdBy: user._id, 
                answeredDate: new Date, 
                questionId: question._id, 
            })


            await expect(percentageQuestion.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing answer date', async function () {
            const user = await new User({
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl", 
                password: "secret"
            });
            
            const review = await new Review({
                createdBy: user._id, 
                title: 'Hoe testerig ben ik?',
                open: true,
            });

            const question = await new Question({
                reviewkey: review._id,
                type: "open",
                content: "Goeie vraag",  
                createdBy: user._id
            });

            const percentageQuestion = await new PercentageQuestion({
                content: "Goed antwoord!", 
                percentage: 100, 
                createdBy: user._id, 
                questionId: question._id, 
            })


            await expect(percentageQuestion.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing answer user', async function () {
            const user = await new User({
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl", 
                password: "secret"
            });
            
            const review = await new Review({
                createdBy: user._id, 
                title: 'Hoe testerig ben ik?',
                open: true,
            });

            const question = await new Question({
                reviewkey: review._id,
                type: "open",
                content: "Goeie vraag",  
                createdBy: user._id
            });

            const percentageQuestion = await new PercentageQuestion({
                content: "Goed antwoord!", 
                percentage: 100,  
                answeredDate: new Date, 
                questionId: question._id, 
            })


            await expect(percentageQuestion.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing answer question ', async function () {
            const user = await new User({
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl", 
                password: "secret"
            });
            
            const review = await new Review({
                createdBy: user._id, 
                title: 'Hoe testerig ben ik?',
                open: true,
            });

            const question = await new Question({
                reviewkey: review._id,
                type: "open",
                content: "Goeie vraag",  
                createdBy: user._id
            });

            const percentageQuestion = await new PercentageQuestion({
                content: "Goed antwoord!", 
                percentage: 100, 
                answeredDate: new Date, 
                questionId: question._id, 
            })


            await expect(percentageQuestion.save()).to.be.rejectedWith(Error);
        });

        it('should reject missing percentage', async function () {
            const user = await new User({
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl", 
                password: "secret"
            });
            
            const review = await new Review({
                createdBy: user._id, 
                title: 'Hoe testerig ben ik?',
                open: true,
            });

            const question = await new Question({
                reviewkey: review._id,
                type: "open",
                content: "Goeie vraag",  
                createdBy: user._id
            });

            const percentageQuestion = await new PercentageQuestion({
                content: "Goed antwoord!", 
                createdBy: user._id, 
                answeredDate: new Date, 
                questionId: question._id, 
            })

            await expect(percentageQuestion.save()).to.be.ok;
        });
    });
});
