// reads the .env file and stores it as environment variables, use for config
require('dotenv').config();

const localconnect = require('./localconnect');

//IMPORT MODELS HERE

const User = require('./src/models/user.model')(); // note we need to call the model caching function
// const Product = require("./src/models/product.model")(); // note we need to call the model caching function

// connect to the databases
localconnect.mongo(process.env.MONGO_TEST_DB);

beforeEach(async () => {
    // drop both collections before each test
    await Promise.all([User.deleteMany()]);
});
