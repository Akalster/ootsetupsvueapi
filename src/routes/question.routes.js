const express = require('express');
const router = express.Router();

const Question = require('../models/question.model')(); // note we need to call the model caching function

const CrudController = require('../controllers/crud');

const QuestionController = require("../controllers/question.controller")

const QuestionCrudController = new CrudController(Question);

// get all reviews
router.get('/question', QuestionCrudController.getAll);

// get a review
router.get('/question/:id', QuestionCrudController.getOne);

// get all questions per review
router.get('/review/:reviewId/question', QuestionController.getPerReview);

// add a review
router.post('/review/:reviewId/question', QuestionController.create);

// update a review
router.put('/review/:reviewId/question/:questionId', QuestionController.update);

// remove a review
router.delete('/review/:reviewId/question/:questionId', QuestionController.remove);

module.exports = router;
