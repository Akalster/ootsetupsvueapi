const chai = require('chai')
const expect = chai.expect

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const User = require('./user.model')() // note we need to call the model caching function

describe('user model', function() {
    describe('unit tests', function() {
        it('should create an user', async function() {
            const testUser = {
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl", 
                password: "secret"
            }

            const user = await new User(testUser).save()
    
            expect(user).to.have.property('firstname', testUser.firstname)
            expect(user).to.have.property('lastname', testUser.lastname)
            expect(user).to.have.property('team', testUser.team)
            expect(user).to.have.property('email', testUser.email)
            expect(user).to.have.property('password', testUser.password)
        })

        it('should reject a missing user firstname', async function() {
            const testUser = {
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl", 
                password: "secret"
            }
            
            const user = new User(testUser)
    
            await expect(user.save()).to.be.rejectedWith(Error)
        })

        it('should reject a missing user lastname', async function() {
            const testUser = {
                firstname: "Test",
                team: "Oranje", 
                email: "test@test.nl", 
                password: "secret"
            }
            
            const user = new User(testUser)
    
            await expect(user.save()).to.be.rejectedWith(Error)
        })

        it('should reject a missing user team', async function() {
            const testUser = {
                firstname: "Test",
                lastname: "Tester", 
                email: "test@test.nl", 
                password: "secret"
            }
            
            const user = new User(testUser)
    
            await expect(user.save()).to.be.rejectedWith(Error)
        })

        it('should reject a missing user email', async function() {
            const testUser = {
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje",  
                password: "secret"
            }
            
            const user = new User(testUser)
    
            await expect(user.save()).to.be.rejectedWith(Error)
        })

        it('should reject a missing user password', async function() {
            const testUser = {
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl", 
            }
            
            const user = new User(testUser)
    
            await expect(user.save()).to.be.rejectedWith(Error)
        })

    
    
        it('should not create duplicate emails', async function() {
            const testUser1 = {
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl", 
                password: "secret"
            }

            const testUser2 = {
                firstname: "Anders",
                lastname: "Probeerder", 
                team: "Blauw", 
                email: testUser1.email, 
                password: "secreter"
            }

            await new User(testUser1).save()

            const user = new User(testUser2)
            
            await expect(user.save()).to.be.rejectedWith(Error)
    
            let count = await User.find().countDocuments()
            expect(count).to.equal(1)
        })
    })
})