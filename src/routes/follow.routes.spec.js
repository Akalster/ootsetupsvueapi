const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const User = require('../models/user.model')()

describe('follow endpoints', function() {
    describe('integration tests', function() {
        it('(POST /follow/:id) should follow another user', async function() {
            const testUser = {
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: new Date('2010-07-05')
            }

            const userRes = await requester.post('/api/register').send(testUser)

            const userresult = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            })

            const jwt = userresult.body.token;

            const testUser2 = {
                username: "Test2",
                password: "secret2",
                email: "test2@test.nl", 
                birthDate: new Date('2010-07-05')
            }

            const userRes2 = await requester.post('/api/register').send(testUser2)

            const userresult2 = await requester.post("/api/login").send({
                email: "test2@test.nl",
                password: "secret2"
            })

            const jwt2 = userresult2.body.token;

            const followedUser = await User.findOne({username: testUser2.username})

            const follow = await requester.post(`/api/follow/${followedUser._id}`).set({ Authorization: `Bearer ${jwt}` }).send();
            expect(follow).to.have.status(201);
        })

        it('(DELETE /follow/:id) should unfollow another user', async function() {
            const testUser = {
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: new Date('2010-07-05')
            }

            const userRes = await requester.post('/api/register').send(testUser)

            const userresult = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            })

            const jwt = userresult.body.token;

            const testUser2 = {
                username: "Test2",
                password: "secret2",
                email: "test2@test.nl", 
                birthDate: new Date('2010-07-05')
            }

            const userRes2 = await requester.post('/api/register').send(testUser2)

            const userresult2 = await requester.post("/api/login").send({
                email: "test2@test.nl",
                password: "secret2"
            })

            const jwt2 = userresult2.body.token;

            const followedUser = await User.findOne({username: testUser2.username})

            const follow = await requester.post(`/api/follow/${followedUser._id}`).set({ Authorization: `Bearer ${jwt}` }).send();
            expect(follow).to.have.status(201);

            const unfollow = await requester.delete(`/api/follow/${followedUser._id}`).set({ Authorization: `Bearer ${jwt}`}).send();
            expect(unfollow).to.have.status(201);
        })

        it('(GET /follow/:id) should get all followed users', async function() {
            const testUser = {
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: new Date('2010-07-05')
            }

            const userRes = await requester.post('/api/register').send(testUser)

            const userresult = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            })

            const jwt = userresult.body.token;

            const testUser2 = {
                username: "Test2",
                password: "secret2",
                email: "test2@test.nl", 
                birthDate: new Date('2010-07-05')
            }

            const userRes2 = await requester.post('/api/register').send(testUser2)

            const userresult2 = await requester.post("/api/login").send({
                email: "test2@test.nl",
                password: "secret2"
            })

            const jwt2 = userresult2.body.token;

            const followedUser = await User.findOne({username: testUser2.username})

            const currentUser = await User.findOne({username: testUser.username})

            const follow = await requester.post(`/api/follow/${followedUser._id}`).set({ Authorization: `Bearer ${jwt}` }).send();
            expect(follow).to.have.status(201);

            const getFollows = await requester.get(`/api/follow/${currentUser._id}`).set({ Authorization: `Bearer ${jwt}`}).send();
            expect(getFollows).to.have.status(200);
            expect(getFollows.body).to.have.length(1);
        })

        it('(GET /follow/:id) should get all followed users of followed users', async function() {
            const testUser = {
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: new Date('2010-07-05')
            }

            const userRes = await requester.post('/api/register').send(testUser)

            const userresult = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            })

            const jwt = userresult.body.token;

            const testUser3 = {
                username: "Test3",
                password: "secret3",
                email: "test3@test.nl", 
                birthDate: new Date('2011-07-05')
            }

            const userRes3 = await requester.post('/api/register').send(testUser3)

            const userresult3 = await requester.post("/api/login").send({
                email: "test3@test.nl",
                password: "secret3"
            })

            const jwt3 = userresult3.body.token;

            const testUser2 = {
                username: "Test2",
                password: "secret2",
                email: "test2@test.nl", 
                birthDate: new Date('2010-07-05')
            }

            const userRes2 = await requester.post('/api/register').send(testUser2)

            const userresult2 = await requester.post("/api/login").send({
                email: "test2@test.nl",
                password: "secret2"
            })

            const jwt2 = userresult2.body.token;

            const followedUser2 = await User.findOne({username: testUser3.username})

            const followedUser = await User.findOne({username: testUser2.username})

            const currentUser = await User.findOne({username: testUser.username})

            const follow = await requester.post(`/api/follow/${followedUser._id}`).set({ Authorization: `Bearer ${jwt}` }).send();
            expect(follow).to.have.status(201);

            const follow2 = await requester.post(`/api/follow/${followedUser2._id}`).set({ Authorization: `Bearer ${jwt2}`}).send();

            const getFollows = await requester.get(`/api/follow/followdeep/${currentUser._id}`).set({ Authorization: `Bearer ${jwt}`}).send();
            expect(getFollows).to.have.status(200);
            expect(getFollows.body).to.have.length(1);
        })

        it('(GET /follow/:id) should get no followed users as follows are one-sided', async function() {
            const testUser = {
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: new Date('2010-07-05')
            }

            const userRes = await requester.post('/api/register').send(testUser)

            const userresult = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            })

            const jwt = userresult.body.token;

            const testUser2 = {
                username: "Test2",
                password: "secret2",
                email: "test2@test.nl", 
                birthDate: new Date('2010-07-05')
            }

            const userRes2 = await requester.post('/api/register').send(testUser2)

            const userresult2 = await requester.post("/api/login").send({
                email: "test2@test.nl",
                password: "secret2"
            })

            const jwt2 = userresult2.body.token;

            const followedUser = await User.findOne({username: testUser2.username})

            const follow = await requester.post(`/api/follow/${followedUser._id}`).set({ Authorization: `Bearer ${jwt}` }).send();
            expect(follow).to.have.status(201);

            const getFollows = await requester.get(`/api/follow/${followedUser._id}`).set({ Authorization: `Bearer ${jwt}`}).send();
            expect(getFollows).to.have.status(200);
            expect(getFollows.body).to.have.length(0);
        })
    })
})