const express = require('express');
const router = express.Router();

const Step = require('../models/step.model')();

const CrudController = require('../controllers/crud');

const StepCrudController = new CrudController(Step);

// Get all steps
router.get('/', StepCrudController.getAll);

// Get a step
router.get('/:id', StepCrudController.getOne);

// Create a step
router.post('/', StepCrudController.create);

// Update a step
router.put('/:id', StepCrudController.update);

// Delete a step
router.delete("/:id", StepCrudController.delete);

module.exports = router;