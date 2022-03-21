const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const User = require('../models/user.model')() // note we need to call the model caching function


describe('authentication endpoints', function() {
    describe('integration tests', function() {
        it('(POST /register) should create a new user', async function() {
            const testUser = {
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: "2012-04-23T18:25:43.511Z"
            }
            
            const res = await requester.post('/api/register').send(testUser)
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')
    
            const user = await User.findOne({email: testUser.email})
            expect(user).to.have.property('username', testUser.username)
            expect(user).to.have.property('email', testUser.email)
            expect(user).to.have.property('birthDate')
            
        })

        it('(POST /register) should not create a user without a username', async function() {
            const testUser = {
                password: "secret",
                email: "test@test.nl", 
                birthDate: "2012-04-23T18:25:43.511Z"
            }

            const res = await requester.post('/api/register').send(testUser)
    
            expect(res).to.have.status(400)
    
            const docCount = await User.find().countDocuments()
            expect(docCount).to.equal(0)
        })
        
        it('(POST /register) should not create a user without a email', async function() {
            const testUser = {
                username: "Test",
                password: "secret",
                birthDate: "2012-04-23T18:25:43.511Z"
            }

            const res = await requester.post('/api/register').send(testUser)
    
            expect(res).to.have.status(400)
    
            const docCount = await User.find().countDocuments()
            expect(docCount).to.equal(0)
        })

        it('(POST /register) should not create a user without a birthDate', async function() {
            const testUser = {
                username: "Test",
                password: "secret",
                email: "test@test.nl"
            }

            const res = await requester.post('/api/register').send(testUser)
    
            expect(res).to.have.status(400)
    
            const docCount = await User.find().countDocuments()
            expect(docCount).to.equal(0)
        })

        it('(POST /register) should not create a user without a password', async function() {
            const testUser = {
                username: "Test",
                email: "test@test.nl",
                birthDate: "2012-04-23T18:25:43.511Z"
            }

            const res = await requester.post('/api/register').send(testUser)
    
            expect(res).to.have.status(500)
    
            const docCount = await User.find().countDocuments()
            expect(docCount).to.equal(0)
        })


        it('(POST /login) should login user if there is a account', async function() {
            const testUser = {
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: "2012-04-23T18:25:43.511Z"
            }
    
            const res = await requester.post('/api/register').send(testUser)
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')
    
            const user = await User.findOne({email: testUser.email})
            expect(user).to.have.property('username', testUser.username)
            expect(user).to.have.property('birthDate')
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
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: "2012-04-23T18:25:43.511Z"
            }
    
            const res = await requester.post('/api/register').send(testUser)
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')
    
            const user = await User.findOne({email: testUser.email})
            expect(user).to.have.property('username', testUser.username)
            expect(user).to.have.property('birthDate')
            expect(user).to.have.property('email', testUser.email)
            
            const res1 = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "wrong"
            });

            expect(res1).to.have.status(404)
        })

        it('(POST /login) should fail is user logs in with wrong password', async function() {
            const testUser = {
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: "2012-04-23T18:25:43.511Z"
            }
    
            const res = await requester.post('/api/register').send(testUser)
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')
    
            const user = await User.findOne({email: testUser.email})
            expect(user).to.have.property('username', testUser.username)
            expect(user).to.have.property('birthDate')
            expect(user).to.have.property('email', testUser.email)
            
            const res1 = await requester.post("/api/login").send({
                email: "wrong@wrong.nl",
                password: "garbage"
            });

            expect(res1).to.have.status(404)
        })
    })

    describe('system tests', function() {
        it('create account; login with account;', async function() {
            const testUser = {
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: "2012-04-23T18:25:43.511Z"
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