const chai = require('chai');
const expect = chai.expect;

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const Review = require('./review.model')(); // note we need to call the model caching function

describe('review model', function () {
    describe('unit tests', function () {
        it('should create an review', async function () {
            const testReview = {
                title: 'Hoe testerig ben ik?',
                open: true,
            };

            const review = await new Review(testReview).save();

            expect(review).to.have.property('createdBy', testReview.createdBy);
            expect(review).to.have.property('title', testReview.title);
            expect(review).to.have.property('open', testReview.open);
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
