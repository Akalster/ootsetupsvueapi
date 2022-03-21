const chai = require('chai');
const expect = chai.expect;

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const User = require('./user.model')(); 
const Route = require('./route.model')();
const Glitch = require('./glitch.model')();
const Step = require('./step.model')(); // note we need to call the model caching function

describe('step model', function () {
    describe('unit tests', function () {
        it('should create a step with a glitch', async function () {

            const user = await new User({
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: "2012-04-23T18:25:43.511Z"
            });
            
            const route = new Route({
                title: "Test%",
                description: "Testing if routes work correctly",
                publishDate: "2014-11-21T13:44:56.511Z",
                createdBy: user._id
            });

            const glitch = new Glitch({
                name: "DOT Skip",
                description: "Skip spiritual stones.",
                publishDate: "2014-11-21T13:44:56.511Z",
                link: "https://www.youtube.com/watch?v=UVWIhdTdnMY",
                createdBy: user._id
            });

            const step = new Step({
                stepnumber: 1,
                description: "First test step",
                glitch: glitch._id,
                route: route._id,
                createdBy: user._id
            });

            await expect(step.save()).to.be.ok;
        });

        it('should create a step without a glitch', async function () {

            const testStep = new Step({
                stepnumber: 1,
                description: "First test step"
            });

            const step = new Step(testStep);

            await expect(step.save()).to.be.ok;
        });

        it('should reject a missing step stepnumber', async function () {
            
            const testStep = {
                description: "First test step"
            };

            const step = new Step(testStep);

            await expect(step.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing step description', async function () {
            
            const testStep = {
                stepnumber: 1
            };

            const step = new Step(testStep);

            await expect(step.save()).to.be.rejectedWith(Error);
        });

        it('should reject a non-positive step stepnumber', async function () {
            
            const testStep = {
                stepnumber: -5,
                description: "First test step"
            };

            const step = new Step(testStep);

            await expect(step.save()).to.be.rejectedWith(Error);
        });
    });
});
