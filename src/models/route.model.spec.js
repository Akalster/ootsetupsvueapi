const chai = require('chai');
const expect = chai.expect;

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const User = require('./user.model')(); 
const Route = require('./route.model')(); // note we need to call the model caching function

describe('route model', function () {
    describe('unit tests', function () {
        it('should create a route', async function () {

            const user = await new User({
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: "2012-04-23T18:25:43.511Z"
            });
            
            const route = new Route({
                title: "Test%",
                description: "Testing if routes work correctly",
                current: true,
                publishDate: "2014-11-21T13:44:56.511Z",
                createdBy: user._id
            });

            await expect(route.save()).to.be.ok;
        });

        it('should reject a missing route name', async function () {
            
            const testRoute = {
                description: "Testing if routes work correctly",
                publishDate: "2014-11-21T13:44:56.511Z",
                current: true,
            };

            const route = new Route(testRoute);

            await expect(route.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing route description', async function () {
            
            const testRoute = {
                title: "Test%",
                publishDate: "2014-11-21T13:44:56.511Z",
                current: true,
            };

            const route = new Route(testRoute);

            await expect(route.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing route publishDate', async function () {
            
            const testRoute = {
                title: "Test%",
                description: "Testing if routes work correctly",
                current: true,
            };

            const route = new Route(testRoute);

            await expect(route.save()).to.be.rejectedWith(Error);
        });

        it('should reject a future route publishDate', async function () {
            
            const testRoute = {
                title: "Test%",
                description: "Testing if routes work correctly",
                publishDate: "2114-11-21T13:44:56.511Z",
                current: true,
            };

            const route = new Route(testRoute);

            await expect(route.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing route current boolean', async function () {
            
            const testRoute = {
                title: "Test%",
                description: "Testing if routes work correctly",
                publishDate: "2014-11-21T13:44:56.511Z",
            };

            const route = new Route(testRoute);

            await expect(route.save()).to.be.rejectedWith(Error);
        });
    });
});
