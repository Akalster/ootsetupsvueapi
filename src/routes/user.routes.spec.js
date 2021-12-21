const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const User = require('../models/user.model')() // note we need to call the model caching function

async function createUser() {

    await requester.post("/api/register").send({
        firstname: "Test",
        lastname: "Tester",
        team: "Oranje",
        email: "test@test.nl",
        password: "secret"
    });

    const result = await requester.post("/api/login").send({
        email: "test@test.nl",
        password: "secret"
    });

    return result.body.token;
}

describe('authentication endpoints', function() {
    describe('integration tests', function() {
        it('(PUT /user/:id) should update a user', async function() {
            const testUser = {
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl", 
                password: "secret"
            }

            const updateUser = {
                firstname: "Karel",
                lastname: "Marel", 
                team: "Blauw", 
                email: "karel@test.nl", 
            }
    
            const res = await requester.post('/api/register').send(testUser)
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')
    
            const user = await User.findOne({email: testUser.email})
            expect(user).to.have.property('firstname', testUser.firstname)
            expect(user).to.have.property('lastname', testUser.lastname)
            expect(user).to.have.property('team', testUser.team)
            expect(user).to.have.property('email', testUser.email)
            
            const result = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            });
            expect(result).to.have.status(201)
            const jwt = result.body.token;

            const userId = user._id; 

            const res1 = await requester.put(`/api/user/${userId}`).set({ Authorization: `Bearer ${jwt}` }).send(updateUser)
            expect(res1).to.have.status(204)

            const updatedUserResult = await User.findOne({_id: userId}); 
            expect(updatedUserResult).to.have.property('firstname', updateUser.firstname)
            expect(updatedUserResult).to.have.property('lastname', updateUser.lastname)
            expect(updatedUserResult).to.have.property('team', updateUser.team)
            expect(updatedUserResult).to.have.property('email', updateUser.email)
            
        })


        it('(DELETE /user/:id) should delete a user', async function() {
            const testUser = {
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl", 
                password: "secret"
            }

            const res = await requester.post('/api/register').send(testUser)
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')
    
            const user = await User.findOne({email: testUser.email})
            expect(user).to.have.property('firstname', testUser.firstname)
            expect(user).to.have.property('lastname', testUser.lastname)
            expect(user).to.have.property('team', testUser.team)
            expect(user).to.have.property('email', testUser.email)
            
            const result = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            });
            expect(result).to.have.status(201)
            const jwt = result.body.token;

            const userId = user._id; 

            const res1 = await requester.delete(`/api/user/${userId}`).set({ Authorization: `Bearer ${jwt}` }).send()
            expect(res1).to.have.status(204)

            const docCount = await User.find().countDocuments()
            expect(docCount).to.equal(0)
            
        })

        it('(get /user/:id) should get a user', async function() {
            const testUser = {
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl", 
                password: "secret"
            }

            const res = await requester.post('/api/register').send(testUser)
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')
    
            const user = await User.findOne({email: testUser.email})
            expect(user).to.have.property('firstname', testUser.firstname)
            expect(user).to.have.property('lastname', testUser.lastname)
            expect(user).to.have.property('team', testUser.team)
            expect(user).to.have.property('email', testUser.email)
            
            const result = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            });
            expect(result).to.have.status(201)
            const jwt = result.body.token;

            const userId = user._id; 

            const res1 = await requester.get(`/api/user/${userId}`).set({ Authorization: `Bearer ${jwt}` }).send()
            expect(res1).to.have.status(200)
        })

        it('(get /user/) should get all user', async function() {
            const testUser = {
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl", 
                password: "secret"
            }

            const res = await requester.post('/api/register').send(testUser)
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')
    
            const user = await User.findOne({email: testUser.email})
            expect(user).to.have.property('firstname', testUser.firstname)
            expect(user).to.have.property('lastname', testUser.lastname)
            expect(user).to.have.property('team', testUser.team)
            expect(user).to.have.property('email', testUser.email)
            
            const result = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            });
            expect(result).to.have.status(201)
            const jwt = result.body.token;

            const userId = user._id; 

            const res1 = await requester.get(`/api/user/${userId}`).set({ Authorization: `Bearer ${jwt}` }).send()
            expect(res1).to.have.status(200)
        })
    })
})