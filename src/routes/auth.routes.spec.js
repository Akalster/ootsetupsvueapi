const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const User = require('../models/user.model')() // note we need to call the model caching function


describe('authentication endpoints', function() {
    describe('integration tests', function() {
        it('(POST /register) should create a new user', async function() {
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
            
        })

        it('(POST /register) should not create a user without a firstname', async function() {
            const testUser = {
                lastname: "Tester", 
                team: "Oranje",  
                email: "test@test.nl",
                password: "secret"
            }

            const res = await requester.post('/api/register').send(testUser)
    
            expect(res).to.have.status(400)
    
            const docCount = await User.find().countDocuments()
            expect(docCount).to.equal(0)
        })
        
        it('(POST /register) should not create a user without a lastname', async function() {
            const testUser = {
                firstname: "Test", 
                team: "Oranje",  
                email: "test@test.nl",
                password: "secret"
            }

            const res = await requester.post('/api/register').send(testUser)
    
            expect(res).to.have.status(400)
    
            const docCount = await User.find().countDocuments()
            expect(docCount).to.equal(0)
        })

        it('(POST /register) should not create a user without a team', async function() {
            const testUser = {
                firstname: "Test",
                lastname: "Test",   
                email: "test@test.nl",
                password: "secret"
            }

            const res = await requester.post('/api/register').send(testUser)
    
            expect(res).to.have.status(400)
    
            const docCount = await User.find().countDocuments()
            expect(docCount).to.equal(0)
        })

        it('(POST /register) should not create a user without a email', async function() {
            const testUser = {
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje",  
                password: "secret"
            }

            const res = await requester.post('/api/register').send(testUser)
    
            expect(res).to.have.status(400)
    
            const docCount = await User.find().countDocuments()
            expect(docCount).to.equal(0)
        })

        it('(POST /register) should not create a user without a password', async function() {
            const testUser = {
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl"
            }

            const res = await requester.post('/api/register').send(testUser)
    
            expect(res).to.have.status(500)
    
            const docCount = await User.find().countDocuments()
            expect(docCount).to.equal(0)
        })


        it('(POST /login) should login user if there is a account', async function() {
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
            
            const res1 = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            });

            expect(res1).to.have.status(201)
            expect(res1.body).to.have.property('token')
        })

        it('(POST /login) should fail is user logs in with wrong password', async function() {
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
            
            const res1 = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "garbage"
            });

            expect(res1).to.have.status(404)
        })

        it('(POST /login) should fail is user logs in with wrong email', async function() {
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
            
            const res1 = await requester.post("/api/login").send({
                email: "garbage@test.nl",
                password: "secret"
            });

            expect(res1).to.have.status(404)
        })
    })

    describe('system tests', function() {
        it('create account; login with account;', async function() {
            const testUser = {
                firstname: "Test",
                lastname: "Tester", 
                team: "Oranje", 
                email: "test@test.nl", 
                password: "secret"
            }

            const res1 = await requester.post('/api/register').send(testUser)
            expect(res1).to.have.status(201)
            expect(res1.body).to.have.property('_id')
            

            const res2 = await requester.post('/api/login').send({
                email: testUser.email, 
                password: testUser.password
            })
            expect(res2).to.have.status(201)
            expect(res2.body).to.have.property('token')
          

            
        })
    })
})