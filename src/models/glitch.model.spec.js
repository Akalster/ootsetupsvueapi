const chai = require('chai');
const expect = chai.expect;

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const User = require('./user.model')(); 
const Glitch = require('./glitch.model')(); // note we need to call the model caching function

describe('glitch model', function () {
    describe('unit tests', function () {
        it('should create an glitch', async function () {

            const user = await new User({
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: "2012-04-23T18:25:43.511Z"
            });
            
            const glitch = new Glitch({
                name: "DOT Skip",
                description: "Skip spiritual stones.",
                publishDate: "2014-11-21T13:44:56.511Z",
                link: "https://www.youtube.com/watch?v=UVWIhdTdnMY",
                createdBy: user._id
            });

            await expect(glitch.save()).to.be.ok;
        });

        it('should reject a missing glitch name', async function () {
            
            const testGlitch = {
                description: "Skip spiritual stones.",
                publishDate: "2014-11-21T13:44:56.511Z",
                link: "https://www.youtube.com/watch?v=UVWIhdTdnMY"
            };

            const glitch = new Glitch(testGlitch);

            await expect(glitch.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing glitch description', async function () {
            
            const testGlitch = {
                name: "DOT Skip",
                publishDate: "2014-11-21T13:44:56.511Z",
                link: "https://www.youtube.com/watch?v=UVWIhdTdnMY"
            };

            const glitch = new Glitch(testGlitch);

            await expect(glitch.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing glitch publishDate', async function () {
            
            const testGlitch = {
                name: "DOT Skip",
                description: "Skip spiritual stones.",
                link: "https://www.youtube.com/watch?v=UVWIhdTdnMY"
            };

            const glitch = new Glitch(testGlitch);

            await expect(glitch.save()).to.be.rejectedWith(Error);
        });

        it('should reject a missing glitch link', async function () {
            
            const testGlitch = {
                name: "DOT Skip",
                description: "Skip spiritual stones.",
                publishDate: "2014-11-21T13:44:56.511Z"
            };

            const glitch = new Glitch(testGlitch);

            await expect(glitch.save()).to.be.rejectedWith(Error);
        });

        it('should reject a future glitch publishDate', async function () {
            
            const testGlitch = {
                name: "DOT Skip",
                description: "Skip spiritual stones.",
                publishDate: "2114-11-21T13:44:56.511Z",
                link: "https://www.youtube.com/watch?v=UVWIhdTdnMY"
            };

            const glitch = new Glitch(testGlitch);

            await expect(glitch.save()).to.be.rejectedWith(Error);
        });

        it('should reject a non youtube link', async function () {
            
            const testGlitch = {
                name: "DOT Skip",
                description: "Skip spiritual stones.",
                publishDate: "2114-11-21T13:44:56.511Z",
                link: "https://brightspace.avans.nl/d2l/home"
            };

            const glitch = new Glitch(testGlitch);

            await expect(glitch.save()).to.be.rejectedWith(Error);
        });
    });
});