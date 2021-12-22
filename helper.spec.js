// reads the .env file and stores it as environment variables, use for config
require('dotenv').config();

const localconnect = require('./connect');

//IMPORT MODELS HERE

const User = require('./src/models/user.model')(); // note we need to call the model caching function
const Review = require('./src/models/review.model')();
const Question = require('./src/models/question.model')();
const Answer = require('./src/models/question.model')();
// const Product = require("./src/models/product.model")(); // note we need to call the model caching function

// connect to the databases
localconnect.mongo(process.env.MONGO_TEST_DB);

beforeEach(async () => {
    // drop both collections before each test
    await Promise.all([User.deleteMany(), Review.deleteMany(), Question.deleteMany(), Answer.deleteMany()]);
});
