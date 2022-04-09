const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const Route = require('../models/route.model')()

describe('route endpoints', function() {
    describe('integration tests', function() {
        it('(POST /route/) should post a route', async function() {
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

            const testRoute = {
                title: "Any%",
                description: "Complete as fast as possible",
                current: true,
                publishDate: new Date('2012-07-05')
            }
            const res = await requester.post("/api/route").set({ Authorization: `Bearer ${jwt}` }).send(testRoute);
            expect(res).to.have.status(201)

            const route = await Route.findOne({title: testRoute.title})
            expect(route).to.have.property('title', testRoute.title)
            expect(route).to.have.property('description', testRoute.description)
            expect(route.publishDate.toString()).to.equal(new Date('2012-07-05').toString())
        })

        it('(PUT /route/) should update a route', async function() {
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

            const testRoute = {
                title: "Any%",
                description: "Complete as fast as possible",
                current: true,
                publishDate: new Date('2012-07-05')
            }
            const res = await requester.post("/api/route").set({ Authorization: `Bearer ${jwt}` }).send(testRoute);
            expect(res).to.have.status(201)

            const route = await Route.findOne({title: testRoute.title})
            expect(route).to.have.property('title', testRoute.title)
            expect(route).to.have.property('description', testRoute.description)
            expect(route.publishDate.toString()).to.equal(new Date('2012-07-05').toString())

            const updateTestRoute = {
                title: "Any%",
                description: "Complete as fast as possible twice",
                publishDate: new Date('2012-07-05')
            }

            const routeUpdate = await requester.put(`/api/route/${route._id}`).set({ Authorization: `Bearer ${jwt}` }).send(updateTestRoute);
            expect(routeUpdate).to.have.status(204)
        })

        it('(PUT /route/) should not update a route from another user', async function() {
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

            const testRoute = {
                title: "Any%",
                description: "Complete as fast as possible",
                current: true,
                publishDate: new Date('2012-07-05')
            }

            const res = await requester.post("/api/route").set({ Authorization: `Bearer ${jwt}` }).send(testRoute);
            expect(res).to.have.status(201)

            const route = await Route.findOne({title: testRoute.title})
            expect(route).to.have.property('title', testRoute.title)
            expect(route).to.have.property('description', testRoute.description)
            expect(route.publishDate.toString()).to.equal(new Date('2012-07-05').toString())

            const updateTestRoute = {
                title: "DOT Skip",
                description: "Skip spiritual stones.",
                current: true,
                publishDate: "2014-11-21T13:44:56.511Z",
                link: "https://www.youtube.com/watch?v=UVWIhdTdnMY"
            }

            const routeUpdate = await requester.put(`/api/route/${route._id}`).set({ Authorization: `Bearer ${jwt2}` }).send(updateTestRoute);
            expect(routeUpdate).to.have.status(401)
            expect(routeUpdate.body).to.have.property('message', "Not authorized!")
        })

        it('(DELETE /route/) should delete a route', async function() {
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

            const testRoute = {
                title: "Any%",
                description: "Complete as fast as possible",
                current: true,
                publishDate: new Date('2012-07-05')
            }

            const res = await requester.post("/api/route").set({ Authorization: `Bearer ${jwt}` }).send(testRoute);
            expect(res).to.have.status(201)

            const route = await Route.findOne({title: testRoute.title})
            expect(route).to.have.property('title', testRoute.title)
            expect(route).to.have.property('description', testRoute.description)
            expect(route.publishDate.toString()).to.equal(new Date('2012-07-05').toString())

            const routeDelete = await requester.delete(`/api/route/${route._id}`).set({ Authorization: `Bearer ${jwt}` }).send();
            expect(routeDelete).to.have.status(204)

            const docCount = await Route.find().countDocuments()
            expect(docCount).to.equal(0)
        })

        it('(DELETE /route/) should not delete a route from another user', async function() {
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

            const testRoute = {
                title: "Any%",
                description: "Complete as fast as possible",
                current: true,
                publishDate: new Date('2012-07-05')
            }

            const res = await requester.post("/api/route").set({ Authorization: `Bearer ${jwt}` }).send(testRoute);
            expect(res).to.have.status(201)

            const route = await Route.findOne({title: testRoute.title})
            expect(route).to.have.property('title', testRoute.title)
            expect(route).to.have.property('description', testRoute.description)
            expect(route.publishDate.toString()).to.equal(new Date('2012-07-05').toString())

            const routeDelete = await requester.delete(`/api/route/${route._id}`).set({ Authorization: `Bearer ${jwt2}` }).send();
            expect(routeDelete).to.have.status(401)
            expect(routeDelete.body).to.have.property('message', "Not authorized!")
        })

        it('(GET /route/) should get all routes', async function() {
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

            const testRoute = {
                title: "Any%",
                description: "Complete as fast as possible",
                current: true,
                publishDate: new Date('2012-07-05')
            }

            const res = await requester.post("/api/route").set({ Authorization: `Bearer ${jwt}` }).send(testRoute);
            expect(res).to.have.status(201)

            const route = await Route.findOne({title: testRoute.title})
            expect(route).to.have.property('title', testRoute.title)
            expect(route).to.have.property('description', testRoute.description)
            expect(route.publishDate.toString()).to.equal(new Date('2012-07-05').toString())

            const routes = await requester.get("/api/route").set({ Authorization: `Bearer ${jwt}` }).send();

            expect(routes.body).to.have.length(1);
        })

        it('(GET /route/) should get one route', async function() {
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

            const testRoute = {
                title: "Any%",
                description: "Complete as fast as possible",
                current: true,
                publishDate: new Date('2012-07-05')
            }

            const res = await requester.post("/api/route").set({ Authorization: `Bearer ${jwt}` }).send(testRoute);
            expect(res).to.have.status(201)

            const route = await Route.findOne({title: testRoute.title})
            expect(route).to.have.property('title', testRoute.title)
            expect(route).to.have.property('description', testRoute.description)
            expect(route.publishDate.toString()).to.equal(new Date('2012-07-05').toString())

            const getRoute = await requester.get(`/api/route/${route._id}`).set({ Authorization: `Bearer ${jwt}` }).send();

            expect(getRoute).to.have.status(200)
            expect(getRoute.body).to.have.property('title', testRoute.title)
            expect(getRoute.body).to.have.property('description', testRoute.description)
            expect(route.publishDate.toString()).to.equal(new Date('2012-07-05').toString())
        })
    })
})