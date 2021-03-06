const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const User = require('../models/user.model')()

describe('user endpoints', function() {
    describe('integration tests', function() {
        it('(PUT /user/:id) should update a user', async function() {
            const testUser = {
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: new Date('2010-07-05')
            }

            const updateUser = {
                username: "Test",
                email: "test@test.nl", 
                birthDate: new Date('2010-07-05')
            }
    
            const res = await requester.post('/api/register').send(testUser)
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')
    
            const user = await User.findOne({email: testUser.email})
            expect(user).to.have.property('username', testUser.username)
            expect(user.birthDate.toString()).to.equal(new Date('2010-07-05').toString())
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
            expect(updatedUserResult).to.have.property('username', updateUser.username)
            expect(updatedUserResult.birthDate.toString()).to.equal(new Date('2010-07-05').toString())
            expect(updatedUserResult).to.have.property('email', updateUser.email)
            
        })


        it('(DELETE /user/:id) should delete a user', async function() {
            const testUser = {
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: new Date('2010-07-05')
            }

            const res = await requester.post('/api/register').send(testUser)
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')
    
            const user = await User.findOne({email: testUser.email})
            expect(user).to.have.property('username', testUser.username)
            expect(user.birthDate.toString()).to.equal(new Date('2010-07-05').toString())
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
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: new Date('2010-07-05')
            }

            const res = await requester.post('/api/register').send(testUser)
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')
    
            const user = await User.findOne({email: testUser.email})
            expect(user).to.have.property('username', testUser.username)
            expect(user.birthDate.toString()).to.equal(new Date('2010-07-05').toString())
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
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: new Date('2010-07-05')
            }

            const res = await requester.post('/api/register').send(testUser)
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')
    
            const user = await User.findOne({email: testUser.email})
            expect(user).to.have.property('username', testUser.username)
            expect(user.birthDate.toString()).to.equal(new Date('2010-07-05').toString())
            expect(user).to.have.property('email', testUser.email)
            
            const result = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            });
            expect(result).to.have.status(201)
            const jwt = result.body.token;

            const res1 = await requester.get(`/api/user`).set({ Authorization: `Bearer ${jwt}` }).send()
            expect(res1).to.have.status(200)
        })
    })
})