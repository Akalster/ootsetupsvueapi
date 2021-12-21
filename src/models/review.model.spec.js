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
                reviewkey: uuidv4(),
                userfirstname: 'Test',
                userlastname: 'Tester',
                userteam: 'Oranje',
                useremail: 'test@test.nl',
                title: 'Hoe testerig ben ik?',
                open: true,
                postdate: Date.now(),
            };

            const review = await new Review(testReview).save();

            expect(review).to.have.property('reviewkey', testReview.reviewkey);
            expect(review).to.have.property(
                'userfirstname',
                testReview.userfirstname
            );
            expect(review).to.have.property(
                'userlastname',
                testReview.userlastname
            );
            expect(review).to.have.property('userteam', testReview.userteam);
            expect(review).to.have.property('useremail', testReview.useremail);
            expect(review).to.have.property('title', testReview.title);
            expect(review).to.have.property('open', testReview.open);
            expect(review).to.have.property('postdate', testReview.postdate);
        });

        it('should reject a missing review reviewkey', async function () {
            const testReview = {
                userfirstname: 'Test',
                userlastname: 'Tester',
                userteam: 'Oranje',
                useremail: 'test@test.nl',
                title: 'Hoe testerig ben ik?',
                open: true,
                postdate: Date.now(),
            };

            const review = new Review(testReview);

            await expect(review.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing review userfirstname', async function () {
            const testReview = {
                reviewkey: uuidv4(),
                userlastname: 'Tester',
                userteam: 'Oranje',
                useremail: 'test@test.nl',
                title: 'Hoe testerig ben ik?',
                open: true,
                postdate: Date.now(),
            };

            const review = new Review(testReview);

            await expect(review.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing review userlastname', async function () {
            const testReview = {
                reviewkey: uuidv4(),
                userfirstname: 'Test',
                userteam: 'Oranje',
                useremail: 'test@test.nl',
                title: 'Hoe testerig ben ik?',
                open: true,
                postdate: Date.now(),
            };

            const review = new Review(testReview);

            await expect(review.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing review userteam', async function () {
            const testReview = {
                reviewkey: uuidv4(),
                userfirstname: 'Test',
                userlastname: 'Tester',
                useremail: 'test@test.nl',
                title: 'Hoe testerig ben ik?',
                open: true,
                postdate: Date.now(),
            };

            const review = new Review(testReview);

            await expect(review.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing review useremail', async function () {
            const testReview = {
                reviewkey: uuidv4(),
                userfirstname: 'Test',
                userlastname: 'Tester',
                userteam: 'Oranje',
                title: 'Hoe testerig ben ik?',
                open: true,
                postdate: Date.now(),
            };

            const review = new Review(testReview);

            await expect(review.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing review title', async function () {
            const testReview = {
                reviewkey: uuidv4(),
                userfirstname: 'Test',
                userlastname: 'Tester',
                userteam: 'Oranje',
                useremail: 'test@test.nl',
                open: true,
                postdate: Date.now(),
            };

            const review = new Review(testReview);

            await expect(review.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing review open', async function () {
            const testReview = {
                reviewkey: uuidv4(),
                userfirstname: 'Test',
                userlastname: 'Tester',
                userteam: 'Oranje',
                useremail: 'test@test.nl',
                title: 'Hoe testerig ben ik?',
                postdate: Date.now(),
            };

            const review = new Review(testReview);

            await expect(review.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing review postdate', async function () {
            const testReview = {
                reviewkey: uuidv4(),
                userfirstname: 'Test',
                userlastname: 'Tester',
                userteam: 'Oranje',
                useremail: 'test@test.nl',
                title: 'Hoe testerig ben ik?',
                open: true,
            };

            const review = new Review(testReview);

            await expect(review.save()).to.be.rejectedWith(Error);
        });

        it('should not create duplicate reviewkeys', async function () {
            const testReview1 = {
                reviewkey: uuidv4(),
                userfirstname: 'Test',
                userlastname: 'Tester',
                userteam: 'Oranje',
                useremail: 'test@test.nl',
                title: 'Hoe testerig ben ik?',
                open: true,
                postdate: Date.now(),
            };

            const testReview2 = {
                reviewkey: testReview1.reviewkey,
                userfirstname: 'Test',
                userlastname: 'Tester',
                userteam: 'Oranje',
                useremail: 'test@test.nl',
                title: 'Hoe testerig ben ik?',
                open: true,
                postdate: Date.now(),
            };

            await new Review(testReview1).save();

            const review = new Review(testReview2);

            await expect(review.save()).to.be.rejectedWith(Error);

            let count = await Review.find().countDocuments();
            expect(count).to.equal(1);
        });
    });
});
