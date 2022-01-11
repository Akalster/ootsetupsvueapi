const express = require('express');
const router = express.Router();

const OpenAnswer = require('../models/openAnswer.model')(); // note we need to call the model caching function
const MultipileChoiceAnswer = require("../models/multipileChoiceAnswer.model")();
const ScaleAnswer = require("../models/scaleAnswer.model")(); 
const PercentageAnswer = require("../models/percentageAnswer.model")(); 

const CrudController = require('../controllers/answer.crud.controller');

const OpenAnswerCrudController = new CrudController(OpenAnswer);
const MultipileChoiceAnswerCrudController = new CrudController(MultipileChoiceAnswer);
const ScaleAnswerCrudController = new CrudController(ScaleAnswer);
const PercentageAnswerCrudController = new CrudController(PercentageAnswer);


// get a review
router.get('/answer/open/:questionId', OpenAnswerCrudController.getAnswerByQuestionId);

router.get('/answer/multi/:questionId', MultipileChoiceAnswerCrudController.getAnswerByQuestionId);

router.get('/answer/scale/:questionId', ScaleAnswerCrudController.getAnswerByQuestionId);

router.get('/answer/percentage/:questionId', PercentageAnswerCrudController.getAnswerByQuestionId);

// add a review
router.post('/question/:questionId/answer/open', OpenAnswerCrudController.create);

router.post('/question/:questionId/answer/multi', MultipileChoiceAnswerCrudController.create);

router.post('/question/:questionId/answer/scale', ScaleAnswerCrudController.create);

router.post('/question/:questionId/answer/percentage', PercentageAnswerCrudController.create);


// update a review
router.put('/question/:questionId/answer/open/:answerId', OpenAnswerCrudController.update);

router.put('/question/:questionId/answer/multi/:answerId', MultipileChoiceAnswerCrudController.update);

router.put('/question/:questionId/answer/scale/:answerId', ScaleAnswerCrudController.update);

router.put('/question/:questionId/answer/percentage/:answerId', PercentageAnswerCrudController.update);

// remove a review
router.delete('/question/:questionId/answer/open/:answerId', OpenAnswerCrudController.delete);

router.delete('/question/:questionId/answer/multi/:answerId', MultipileChoiceAnswerCrudController.delete);

router.delete('/question/:questionId/answer/scale/:answerId', ScaleAnswerCrudController.delete);

router.delete('/question/:questionId/answer/percentage/:answerId', PercentageAnswerCrudController.delete);

module.exports = router;
