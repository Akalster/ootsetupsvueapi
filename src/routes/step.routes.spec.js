const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const Step = require('../models/step.model')()
const Glitch = require('../models/glitch.model')()
const Route = require('../models/route.model')()

describe('step endpoints', function() {
    describe('integration tests', function() {
        it('(POST /step/) should post a step', async function() {
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
            const glitchRes = await requester.post("/api/glitch").set({ Authorization: `Bearer ${jwt}` }).send(testGlitch);
            expect(glitchRes).to.have.status(201)
            const glitch = await Glitch.findOne({name: testGlitch.name})

            const testRoute = {
                title: "Any%",
                description: "Complete as fast as possible",
                current: true,
                publishDate: new Date('2012-07-05')
            }
            const routeRes = await requester.post("/api/route").set({ Authorization: `Bearer ${jwt}` }).send(testRoute);
            expect(routeRes).to.have.status(201)
            const route = await Route.findOne({title: testRoute.title})

            const testStep = {
                stepnumber: "1",
                description: "Perform DoT skip",
                optional: true,
                glitch: `${glitch._id}`,
                route: `${route._id}`
            }

            const res = await requester.post("/api/step").set({ Authorization: `Bearer ${jwt}` }).send(testStep);
            expect(res).to.have.status(201)

            const step = await Step.findOne({stepnumber: testStep.stepnumber})
            expect(step.stepnumber.toString()).to.equal(testStep.stepnumber)
            expect(step).to.have.property('description', testStep.description)
            expect(step.glitch._id.toString()).to.equal(`${glitch._id}`)
            expect(step.route._id.toString()).to.equal(`${route._id}`)
        })

        it('(PUT /step/) should update a step', async function() {
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
            const glitchRes = await requester.post("/api/glitch").set({ Authorization: `Bearer ${jwt}` }).send(testGlitch);
            expect(glitchRes).to.have.status(201)
            const glitch = await Glitch.findOne({name: testGlitch.name})

            const testRoute = {
                title: "Any%",
                description: "Complete as fast as possible",
                current: true,
                publishDate: new Date('2012-07-05')
            }
            const routeRes = await requester.post("/api/route").set({ Authorization: `Bearer ${jwt}` }).send(testRoute);
            expect(routeRes).to.have.status(201)
            const route = await Route.findOne({title: testRoute.title})

            const testStep = {
                stepnumber: "1",
                description: "Perform DoT skip",
                optional: true,
                glitch: `${glitch._id}`,
                route: `${route._id}`
            }

            const res = await requester.post("/api/step").set({ Authorization: `Bearer ${jwt}` }).send(testStep);
            expect(res).to.have.status(201)

            const step = await Step.findOne({stepnumber: testStep.stepnumber})
            expect(step.stepnumber.toString()).to.equal(testStep.stepnumber)
            expect(step).to.have.property('description', testStep.description)
            expect(step.glitch._id.toString()).to.equal(`${glitch._id}`)
            expect(step.route._id.toString()).to.equal(`${route._id}`)

            const updateTestStep = {
                stepnumber: "1",
                description: "Perform DoT skip",
                glitch: `${glitch._id}`,
                route: `${route._id}`
            }

            const stepUpdate = await requester.put(`/api/step/${step._id}`).set({ Authorization: `Bearer ${jwt}` }).send(updateTestStep);
            expect(stepUpdate).to.have.status(204)
        })

        it('(PUT /step/) should not update a step from another user', async function() {
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
            const glitchRes = await requester.post("/api/glitch").set({ Authorization: `Bearer ${jwt}` }).send(testGlitch);
            expect(glitchRes).to.have.status(201)
            const glitch = await Glitch.findOne({name: testGlitch.name})

            const testRoute = {
                title: "Any%",
                description: "Complete as fast as possible",
                current: true,
                publishDate: new Date('2012-07-05')
            }
            const routeRes = await requester.post("/api/route").set({ Authorization: `Bearer ${jwt}` }).send(testRoute);
            expect(routeRes).to.have.status(201)
            const route = await Route.findOne({title: testRoute.title})

            const testStep = {
                stepnumber: "1",
                description: "Perform DoT skip",
                optional: true,
                glitch: `${glitch._id}`,
                route: `${route._id}`
            }

            const res = await requester.post("/api/step").set({ Authorization: `Bearer ${jwt}` }).send(testStep);
            expect(res).to.have.status(201)

            const step = await Step.findOne({stepnumber: testStep.stepnumber})
            expect(step.stepnumber.toString()).to.equal(testStep.stepnumber)
            expect(step).to.have.property('description', testStep.description)
            expect(step.glitch._id.toString()).to.equal(`${glitch._id}`)
            expect(step.route._id.toString()).to.equal(`${route._id}`)

            const updateTestStep = {
                stepnumber: "1",
                description: "Perform DoT skip",
                glitch: `${glitch._id}`,
                route: `${route._id}`
            }

            const stepUpdate = await requester.put(`/api/step/${step._id}`).set({ Authorization: `Bearer ${jwt2}` }).send(updateTestStep);
            expect(stepUpdate).to.have.status(401)
            expect(stepUpdate.body).to.have.property('message', "Not authorized!")
        })

        it('(DELETE /step/) should delete a step', async function() {
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
            const glitchRes = await requester.post("/api/glitch").set({ Authorization: `Bearer ${jwt}` }).send(testGlitch);
            expect(glitchRes).to.have.status(201)
            const glitch = await Glitch.findOne({name: testGlitch.name})

            const testRoute = {
                title: "Any%",
                description: "Complete as fast as possible",
                current: true,
                publishDate: new Date('2012-07-05')
            }
            const routeRes = await requester.post("/api/route").set({ Authorization: `Bearer ${jwt}` }).send(testRoute);
            expect(routeRes).to.have.status(201)
            const route = await Route.findOne({title: testRoute.title})

            const testStep = {
                stepnumber: "1",
                description: "Perform DoT skip",
                optional: true,
                glitch: `${glitch._id}`,
                route: `${route._id}`
            }

            const res = await requester.post("/api/step").set({ Authorization: `Bearer ${jwt}` }).send(testStep);
            expect(res).to.have.status(201)

            const step = await Step.findOne({stepnumber: testStep.stepnumber})
            expect(step.stepnumber.toString()).to.equal(testStep.stepnumber)
            expect(step).to.have.property('description', testStep.description)
            expect(step.glitch._id.toString()).to.equal(`${glitch._id}`)
            expect(step.route._id.toString()).to.equal(`${route._id}`)

            const stepDelete = await requester.delete(`/api/step/${step._id}`).set({ Authorization: `Bearer ${jwt}` }).send();
            expect(stepDelete).to.have.status(204)

            const docCount = await Step.find().countDocuments()
            expect(docCount).to.equal(0)
        })

        it('(DELETE /step/) should not delete a step from another user', async function() {
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
            const glitchRes = await requester.post("/api/glitch").set({ Authorization: `Bearer ${jwt}` }).send(testGlitch);
            expect(glitchRes).to.have.status(201)
            const glitch = await Glitch.findOne({name: testGlitch.name})

            const testRoute = {
                title: "Any%",
                description: "Complete as fast as possible",
                current: true,
                publishDate: new Date('2012-07-05')
            }
            const routeRes = await requester.post("/api/route").set({ Authorization: `Bearer ${jwt}` }).send(testRoute);
            expect(routeRes).to.have.status(201)
            const route = await Route.findOne({title: testRoute.title})

            const testStep = {
                stepnumber: "1",
                description: "Perform DoT skip",
                optional: true,
                glitch: `${glitch._id}`,
                route: `${route._id}`
            }

            const res = await requester.post("/api/step").set({ Authorization: `Bearer ${jwt}` }).send(testStep);
            expect(res).to.have.status(201)

            const step = await Step.findOne({stepnumber: testStep.stepnumber})
            expect(step.stepnumber.toString()).to.equal(testStep.stepnumber)
            expect(step).to.have.property('description', testStep.description)
            expect(step.glitch._id.toString()).to.equal(`${glitch._id}`)
            expect(step.route._id.toString()).to.equal(`${route._id}`)

            const stepDelete = await requester.delete(`/api/step/${step._id}`).set({ Authorization: `Bearer ${jwt2}` }).send();
            expect(stepDelete).to.have.status(401)
            expect(stepDelete.body).to.have.property('message', "Not authorized!")
        })

        it('(GET /step/) should get all steps', async function() {
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
            const glitchRes = await requester.post("/api/glitch").set({ Authorization: `Bearer ${jwt}` }).send(testGlitch);
            expect(glitchRes).to.have.status(201)
            const glitch = await Glitch.findOne({name: testGlitch.name})

            const testRoute = {
                title: "Any%",
                description: "Complete as fast as possible",
                current: true,
                publishDate: new Date('2012-07-05')
            }
            const routeRes = await requester.post("/api/route").set({ Authorization: `Bearer ${jwt}` }).send(testRoute);
            expect(routeRes).to.have.status(201)
            const route = await Route.findOne({title: testRoute.title})

            const testStep = {
                stepnumber: "1",
                description: "Perform DoT skip",
                optional: true,
                glitch: `${glitch._id}`,
                route: `${route._id}`
            }

            const res = await requester.post("/api/step").set({ Authorization: `Bearer ${jwt}` }).send(testStep);
            expect(res).to.have.status(201)

            const step = await Step.findOne({stepnumber: testStep.stepnumber})
            expect(step.stepnumber.toString()).to.equal(testStep.stepnumber)
            expect(step).to.have.property('description', testStep.description)
            expect(step.glitch._id.toString()).to.equal(`${glitch._id}`)
            expect(step.route._id.toString()).to.equal(`${route._id}`)

            const steps = await requester.get("/api/step").set({ Authorization: `Bearer ${jwt}` }).send();

            expect(steps.body).to.have.length(1);
        })

        it('(GET /step/) should get one step', async function() {
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
            const glitchRes = await requester.post("/api/glitch").set({ Authorization: `Bearer ${jwt}` }).send(testGlitch);
            expect(glitchRes).to.have.status(201)
            const glitch = await Glitch.findOne({name: testGlitch.name})

            const testRoute = {
                title: "Any%",
                description: "Complete as fast as possible",
                current: true,
                publishDate: new Date('2012-07-05')
            }
            const routeRes = await requester.post("/api/route").set({ Authorization: `Bearer ${jwt}` }).send(testRoute);
            expect(routeRes).to.have.status(201)
            const route = await Route.findOne({title: testRoute.title})

            const testStep = {
                stepnumber: "1",
                description: "Perform DoT skip",
                optional: true,
                glitch: `${glitch._id}`,
                route: `${route._id}`
            }

            const res = await requester.post("/api/step").set({ Authorization: `Bearer ${jwt}` }).send(testStep);
            expect(res).to.have.status(201)

            const step = await Step.findOne({stepnumber: testStep.stepnumber})
            expect(step.stepnumber.toString()).to.equal(testStep.stepnumber)
            expect(step).to.have.property('description', testStep.description)
            expect(step.glitch._id.toString()).to.equal(`${glitch._id}`)
            expect(step.route._id.toString()).to.equal(`${route._id}`)

            const getStep = await requester.get(`/api/step/${step._id}`).set({ Authorization: `Bearer ${jwt}` }).send();

            expect(getStep).to.have.status(200)
            expect(getStep.body.stepnumber.toString()).to.equal(testStep.stepnumber)
            expect(getStep.body).to.have.property('description', testStep.description)
            expect(getStep.body.glitch.toString()).to.equal(`${glitch._id}`)
            expect(getStep.body.route.toString()).to.equal(`${route._id}`)
        })
    })
})