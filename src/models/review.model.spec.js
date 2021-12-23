const chai = require('chai');
const expect = chai.expect;

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const User = require('./user.model')(); 
const Review = require('./review.model')(); // note we need to call the model caching function

describe('review model', function () {
    describe('unit tests', function () {
        it('should create an review', async function () {

            const user = await new User({
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl", 
                password: "secret"
            });
            
            const review = new Review({
                createdBy: user._id, 
                title: 'Hoe testerig ben ik?',
                open: true,
            });

            await expect(review.save()).to.be.ok;
        });

        it('should reject a missing review title', async function () {
            const testReview = {
                open: true,
            };

            const review = new Review(testReview);

            await expect(review.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing review open', async function () {
            const testReview = {
                title: 'Hoe testerig ben ik?',
            };

            const review = new Review(testReview);

            await expect(review.save()).to.be.rejectedWith(Error);
        });
    });
});
