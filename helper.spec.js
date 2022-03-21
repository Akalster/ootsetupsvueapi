// reads the .env file and stores it as environment variables, use for config
require('dotenv').config();

const localconnect = require('./connect');

//IMPORT MODELS HERE

const User = require('./src/models/user.model')(); // note we need to call the model caching function
const Glitch = require('./src/models/glitch.model')();
const Route = require('./src/models/route.model')();
const Step = require('./src/models/step.model')();

// connect to the databases
localconnect.mongo(process.env.MONGO_TEST_DB);

beforeEach(async () => {
    // drop both collections before each test
    await Promise.all([User.deleteMany(), Glitch.deleteMany(), Route.deleteMany(), Step.deleteMany()]);
});
