const express = require('express');
const router = express.Router();

const OpenAnswer = require('../models/openAnswer.model')(); // note we need to call the model caching function

const CrudController = require('../controllers/crud');

const AnswerCrudController = new CrudController(OpenAnswer);

// get all reviews
router.get('/', AnswerCrudController.getAll);

// get a review
router.get('/:id', AnswerCrudController.getOne);

// add a review
router.post('/', AnswerCrudController.create);

// update a review
router.put('/:id', AnswerCrudController.update);

// remove a review
router.delete('/:id', AnswerCrudController.delete);

module.exports = router;
