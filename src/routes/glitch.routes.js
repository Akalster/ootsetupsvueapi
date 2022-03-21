const express = require('express');
const router = express.Router();

const Glitch = require('../models/glitch.model')();

const CrudController = require('../controllers/crud');

const GlitchCrudController = new CrudController(Glitch);

// Get all glitches
router.get('/', GlitchCrudController.getAll);

// Get a glitch
router.get('/:id', GlitchCrudController.getOne);

// Create a glitch
router.post('/', GlitchCrudController.create);

// Update a glitch
router.put('/:id', GlitchCrudController.update);

// Delete a glitch
router.delete("/:id", GlitchCrudController.delete);

module.exports = router;