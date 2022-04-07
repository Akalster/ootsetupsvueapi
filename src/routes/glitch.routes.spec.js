const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const Glitch = require('../models/glitch.model')()

describe('glitch endpoints', function() {
    describe('integration tests', function() {
        it('(POST /glitch/) should post a glitch', async function() {
            await requester.post("/api/register").send({
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: new Date('2010-07-05')
            });

            const userresult = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            })

            const jwt = userresult.body.token;

            const testGlitch = {
                name: "DOT Skip",
                description: "Skip spiritual stones.",
                publishDate: new Date('2012-07-05'),
                link: "https://www.youtube.com/watch?v=UVWIhdTdnMY"
            }
            const res = await requester.post("/api/glitch").set({ Authorization: `Bearer ${jwt}` }).send(testGlitch);
            expect(res).to.have.status(201)

            const glitch = await Glitch.findOne({name: testGlitch.name})
            expect(glitch).to.have.property('name', testGlitch.name)
            expect(glitch).to.have.property('description', testGlitch.description)
            expect(glitch).to.have.property('link', testGlitch.link)
            expect(glitch.publishDate.toString()).to.equal(new Date('2012-07-05').toString())
        })

        it('(PUT /glitch/) should update a glitch', async function() {
            await requester.post("/api/register").send({
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: new Date('2010-07-05')
            });

            const userresult = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            })

            const jwt = userresult.body.token;

            const testGlitch = {
                name: "DOT Skip",
                description: "Skip spiritual stones.",
                publishDate: new Date('2012-07-05'),
                link: "https://www.youtube.com/watch?v=UVWIhdTdnMY"
            }
            const res = await requester.post("/api/glitch").set({ Authorization: `Bearer ${jwt}` }).send(testGlitch);
            expect(res).to.have.status(201)

            const glitch = await Glitch.findOne({name: testGlitch.name})
            expect(glitch).to.have.property('name', testGlitch.name)
            expect(glitch).to.have.property('description', testGlitch.description)
            expect(glitch).to.have.property('link', testGlitch.link)
            expect(glitch.publishDate.toString()).to.equal(new Date('2012-07-05').toString())

            const updateTestGlitch = {
                name: "DOT Skip",
                description: "Skip spiritual stones. Fun!",
                publishDate: new Date('2012-07-05'),
                link: "https://www.youtube.com/watch?v=UVWIhdTdnMY"
            }

            const glitchUpdate = await requester.put(`/api/glitch/${glitch._id}`).set({ Authorization: `Bearer ${jwt}` }).send(updateTestGlitch);
            expect(glitchUpdate).to.have.status(204)
        })

        it('(PUT /glitch/) should not update a glitch from another user', async function() {
            await requester.post("/api/register").send({
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: new Date('2010-07-05')
            });

            const userresult = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            })

            const jwt = userresult.body.token;

            await requester.post("/api/register").send({
                username: "Test2",
                password: "secret2",
                email: "test2@test.nl", 
                birthDate: new Date('2010-07-05')
            });

            const userresult2 = await requester.post("/api/login").send({
                email: "test2@test.nl",
                password: "secret2"
            })

            const jwt2 = userresult2.body.token;

            const testGlitch = {
                name: "DOT Skip",
                description: "Skip spiritual stones.",
                publishDate: new Date('2012-07-05'),
                link: "https://www.youtube.com/watch?v=UVWIhdTdnMY"
            }
            const res = await requester.post("/api/glitch").set({ Authorization: `Bearer ${jwt}` }).send(testGlitch);
            expect(res).to.have.status(201)

            const glitch = await Glitch.findOne({name: testGlitch.name})
            expect(glitch).to.have.property('name', testGlitch.name)
            expect(glitch).to.have.property('description', testGlitch.description)
            expect(glitch).to.have.property('link', testGlitch.link)
            expect(glitch.publishDate.toString()).to.equal(new Date('2012-07-05').toString())

            const updateTestGlitch = {
                name: "DOT Skip",
                description: "Skip spiritual stones.",
                publishDate: "2014-11-21T13:44:56.511Z",
                link: "https://www.youtube.com/watch?v=UVWIhdTdnMY"
            }

            const glitchUpdate = await requester.put(`/api/glitch/${glitch._id}`).set({ Authorization: `Bearer ${jwt2}` }).send(updateTestGlitch);
            expect(glitchUpdate).to.have.status(401)
            expect(glitchUpdate.body).to.have.property('message', "Not authorized!")
        })

        it('(DELETE /glitch/) should delete a glitch', async function() {
            await requester.post("/api/register").send({
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: new Date('2010-07-05')
            });

            const userresult = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            })

            const jwt = userresult.body.token;

            const testGlitch = {
                name: "DOT Skip",
                description: "Skip spiritual stones.",
                publishDate: new Date('2012-07-05'),
                link: "https://www.youtube.com/watch?v=UVWIhdTdnMY"
            }
            const res = await requester.post("/api/glitch").set({ Authorization: `Bearer ${jwt}` }).send(testGlitch);
            expect(res).to.have.status(201)

            const glitch = await Glitch.findOne({name: testGlitch.name})
            expect(glitch).to.have.property('name', testGlitch.name)
            expect(glitch).to.have.property('description', testGlitch.description)
            expect(glitch).to.have.property('link', testGlitch.link)
            expect(glitch.publishDate.toString()).to.equal(new Date('2012-07-05').toString())

            const glitchDelete = await requester.delete(`/api/glitch/${glitch._id}`).set({ Authorization: `Bearer ${jwt}` }).send();
            expect(glitchDelete).to.have.status(204)

            const docCount = await Glitch.find().countDocuments()
            expect(docCount).to.equal(0)
        })

        it('(DELETE /glitch/) should not delete a glitch from another user', async function() {
            await requester.post("/api/register").send({
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: new Date('2010-07-05')
            });

            const userresult = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            })

            const jwt = userresult.body.token;

            await requester.post("/api/register").send({
                username: "Test2",
                password: "secret2",
                email: "test2@test.nl", 
                birthDate: new Date('2010-07-05')
            });

            const userresult2 = await requester.post("/api/login").send({
                email: "test2@test.nl",
                password: "secret2"
            })

            const jwt2 = userresult2.body.token;

            const testGlitch = {
                name: "DOT Skip",
                description: "Skip spiritual stones.",
                publishDate: new Date('2012-07-05'),
                link: "https://www.youtube.com/watch?v=UVWIhdTdnMY"
            }
            const res = await requester.post("/api/glitch").set({ Authorization: `Bearer ${jwt}` }).send(testGlitch);
            expect(res).to.have.status(201)

            const glitch = await Glitch.findOne({name: testGlitch.name})
            expect(glitch).to.have.property('name', testGlitch.name)
            expect(glitch).to.have.property('description', testGlitch.description)
            expect(glitch).to.have.property('link', testGlitch.link)
            expect(glitch.publishDate.toString()).to.equal(new Date('2012-07-05').toString())

            const glitchDelete = await requester.delete(`/api/glitch/${glitch._id}`).set({ Authorization: `Bearer ${jwt2}` }).send();
            expect(glitchDelete).to.have.status(401)
            expect(glitchDelete.body).to.have.property('message', "Not authorized!")
        })

        it('(GET /glitch/) should get all glitches', async function() {
            await requester.post("/api/register").send({
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: new Date('2010-07-05')
            });

            const userresult = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            })

            const jwt = userresult.body.token;

            const testGlitch = {
                name: "DOT Skip",
                description: "Skip spiritual stones.",
                publishDate: new Date('2012-07-05'),
                link: "https://www.youtube.com/watch?v=UVWIhdTdnMY"
            }
            const res = await requester.post("/api/glitch").set({ Authorization: `Bearer ${jwt}` }).send(testGlitch);
            expect(res).to.have.status(201)

            const glitch = await Glitch.findOne({name: testGlitch.name})
            expect(glitch).to.have.property('name', testGlitch.name)
            expect(glitch).to.have.property('description', testGlitch.description)
            expect(glitch).to.have.property('link', testGlitch.link)
            expect(glitch.publishDate.toString()).to.equal(new Date('2012-07-05').toString())

            const glitches = await requester.get("/api/glitch").set({ Authorization: `Bearer ${jwt}` }).send();

            expect(glitches.body).to.have.length(1);
        })

        it('(GET /glitch/) should get one glitch', async function() {
            await requester.post("/api/register").send({
                username: "Test",
                password: "secret",
                email: "test@test.nl", 
                birthDate: new Date('2010-07-05')
            });

            const userresult = await requester.post("/api/login").send({
                email: "test@test.nl",
                password: "secret"
            })

            const jwt = userresult.body.token;

            const testGlitch = {
                name: "DOT Skip",
                description: "Skip spiritual stones.",
                publishDate: new Date('2012-07-05'),
                link: "https://www.youtube.com/watch?v=UVWIhdTdnMY"
            }
            const res = await requester.post("/api/glitch").set({ Authorization: `Bearer ${jwt}` }).send(testGlitch);
            expect(res).to.have.status(201)

            const glitch = await Glitch.findOne({name: testGlitch.name})
            expect(glitch).to.have.property('name', testGlitch.name)
            expect(glitch).to.have.property('description', testGlitch.description)
            expect(glitch).to.have.property('link', testGlitch.link)
            expect(glitch.publishDate.toString()).to.equal(new Date('2012-07-05').toString())

            const getGlitch = await requester.get(`/api/glitch/${glitch._id}`).set({ Authorization: `Bearer ${jwt}` }).send();

            expect(getGlitch).to.have.status(200)
            expect(getGlitch.body).to.have.property('name', testGlitch.name)
            expect(getGlitch.body).to.have.property('description', testGlitch.description)
            expect(getGlitch.body).to.have.property('link', testGlitch.link)
            expect(glitch.publishDate.toString()).to.equal(new Date('2012-07-05').toString())
        })
    })
})