import { v4 as uuidv4 } from 'uuid';
const chai = require('chai');
const expect = chai.expect;

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const Review = require('./review.model')(); // note we need to call the model caching function

describe('review model', function () {
    describe('unit tests', function () {
        it('should create an review', async function () {
            const testReview = {
                userkey: 'loggedinuser',
                title: 'Hoe testerig ben ik?',
                open: true,
                postdate: Date.now(),
            };

            const review = await new Review(testReview).save();

            expect(review).to.have.property('userkey', testReview.userkey);
            expect(review).to.have.property('title', testReview.title);
            expect(review).to.have.property('open', testReview.open);
            expect(review).to.have.property('postdate', testReview.postdate);
        });

        it('should reject a missing review userkey', async function () {
            const testReview = {
                title: 'Hoe testerig ben ik?',
                open: true,
                postdate: Date.now(),
            };

            const review = new Review(testReview);

            await expect(review.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing review title', async function () {
            const testReview = {
                userkey: 'loggedinuser',
                open: true,
                postdate: Date.now(),
            };

            const review = new Review(testReview);

            await expect(review.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing review open', async function () {
            const testReview = {
                userkey: 'loggedinuser',
                title: 'Hoe testerig ben ik?',
                postdate: Date.now(),
            };

            const review = new Review(testReview);

            await expect(review.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing review postdate', async function () {
            const testReview = {
                userkey: 'loggedinuser',
                title: 'Hoe testerig ben ik?',
                open: true,
            };

            const review = new Review(testReview);

            await expect(review.save()).to.be.rejectedWith(Error);
        });
    });
});
