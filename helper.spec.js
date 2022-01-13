// reads the .env file and stores it as environment variables, use for config
require('dotenv').config();

const localconnect = require('./connect');

//IMPORT MODELS HERE

const User = require('./src/models/user.model')(); // note we need to call the model caching function
const Review = require('./src/models/review.model')();
const Question = require('./src/models/question.model')();
const Teams = require('./src/models/team.model')(); 

const OpenAnswer = require('./src/models/openAnswer.model')();
const MultiAnswer = require('./src/models/multipileChoiceAnswer.model')();
const ScaleAnswer = require('./src/models/scaleAnswer.model')();
const PercentageAnswer = require('./src/models/percentageAnswer.model')();

// connect to the databases
localconnect.mongo(process.env.MONGO_TEST_DB);

beforeEach(async () => {
    // drop both collections before each test
    await Promise.all([User.deleteMany(), Review.deleteMany(), Question.deleteMany(), OpenAnswer.deleteMany(), MultiAnswer.deleteMany(), ScaleAnswer.deleteMany(), Teams.deleteMany()]);
});
