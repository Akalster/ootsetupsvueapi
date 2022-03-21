const chai = require('chai')
const expect = chai.expect

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const User = require('./user.model')() // note we need to call the model caching function

describe('user model', function() {
    describe('unit tests', function() {
        it('should create an user', async function() {
            const testUser = {
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: "2012-04-23T18:25:43.511Z"
            }

            const user = await new User(testUser).save()
    
            expect(user).to.have.property('username', testUser.username)
            expect(user).to.have.property('password', testUser.password)
            expect(user).to.have.property('email', testUser.email)
            expect(user).to.have.property('birthDate')
        })

        it('should reject a missing user username', async function() {
            const testUser = {
                password: "secret",
                email: "test@test.nl", 
                birthDate: "2012-04-23T18:25:43.511Z"
            }
            
            const user = new User(testUser)
    
            await expect(user.save()).to.be.rejectedWith(Error)
        })

        it('should reject a missing user birthDate', async function() {
            const testUser = {
                username: "Test",
                password: "secret",
                email: "test@test.nl"
            }
            
            const user = new User(testUser)
    
            await expect(user.save()).to.be.rejectedWith(Error)
        })

        it('should reject a missing user email', async function() {
            const testUser = {
                username: "Test",
                password: "secret",
                birthDate: "2012-04-23T18:25:43.511Z"
            }
            
            const user = new User(testUser)
    
            await expect(user.save()).to.be.rejectedWith(Error)
        })

        it('should reject a missing user password', async function() {
            const testUser = {
                username: "Test",
                email: "test@test.nl",
                birthDate: "2012-04-23T18:25:43.511Z" 
            }
            
            const user = new User(testUser)
    
            await expect(user.save()).to.be.rejectedWith(Error)
        })

        it('should not create duplicate usernames', async function() {
            const testUser1 = {
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: "2012-04-23T18:25:43.511Z"
            }

            const testUser2 = {
                username: testUser1.username,
                password: "secret2",
                email: "test2@test.nl", 
                birthDate: "2012-04-23T18:25:43.511Z"
            }

            await new User(testUser1).save()

            const user = new User(testUser2)
            
            await expect(user.save()).to.be.rejectedWith(Error)
    
            let count = await User.find().countDocuments()
            expect(count).to.equal(1)
        })
    
        it('should not create duplicate emails', async function() {
            const testUser1 = {
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: "2012-04-23T18:25:43.511Z"
            }

            const testUser2 = {
                username: "Anders",
                password: "secret2",
                email: testUser1.email, 
                birthDate: "2012-04-23T18:25:43.511Z"
            }

            await new User(testUser1).save()

            const user = new User(testUser2)
            
            await expect(user.save()).to.be.rejectedWith(Error)
    
            let count = await User.find().countDocuments()
            expect(count).to.equal(1)
        })

        it('should not create a birthDate in the future', async function() {
            const testUser = {
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: "2112-04-23T18:25:43.511Z"
            }

            const user = new User(testUser)
    
            await expect(user.save()).to.be.rejectedWith(Error)
        })
    })
})