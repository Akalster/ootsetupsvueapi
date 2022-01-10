const express = require('express');
const router = express.Router();

const Review = require('../models/review.model')(); // note we need to call the model caching function

const CrudController = require('../controllers/crud');

const ReviewController = require('../controllers/review.controller');

const ReviewCrudController = new CrudController(Review);

// get all reviews
router.get('/', ReviewCrudController.getAll);

// get a review
router.get('/:id', ReviewCrudController.getOne);

// get all open reviews
router.get('/open', ReviewController.getOpen);

// add a review
router.post('/', ReviewCrudController.create);

// update a review
router.put('/:id', ReviewCrudController.update);

// remove a review
router.delete('/:id', ReviewCrudController.delete);

module.exports = router;
