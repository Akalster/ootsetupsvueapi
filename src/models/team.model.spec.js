const chai = require('chai');
const expect = chai.expect;

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const User = require('./user.model')();
const Team = require('./team.model')(); 

describe('team model', function() {
    it('should create a team', async function () {
        const user = await new User({
            firstname: "Test",
            lastname: "Tester", 
            team: "Oranje", 
            email: "test@test.nl", 
            password: "secret"
        });

        const testTeam = await new Team({
            name: "TestTeam",
            description: "TestDescription",
            createdBy: user._id
        })

        await expect(user.save()).to.be.ok;
        await expect(testTeam.save()).to.be.ok;
    })
})