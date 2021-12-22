const express = require('express');
const router = express.Router();

const Question = require('../models/question.model')(); // note we need to call the model caching function

const CrudController = require('../controllers/crud');

const QuestionCrudController = new CrudController(Question);

// get all reviews
router.get('/', QuestionCrudController.getAll);

// get a review
router.get('/:id', QuestionCrudController.getOne);

// add a review
router.post('/:reviewid', QuestionCrudController.create);

// update a review
router.put('/:id', QuestionCrudController.update);

// remove a review
router.delete('/:id', QuestionCrudController.delete);

module.exports = router;
