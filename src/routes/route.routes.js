const express = require('express');
const router = express.Router();

const Route = require('../models/route.model')();

const CrudController = require('../controllers/crud');

const RouteCrudController = new CrudController(Route);

// Get all routes
router.get('/', RouteCrudController.getAll);

// Get a route
router.get('/:id', RouteCrudController.getOne);

// Create a route
router.post('/', RouteCrudController.create);

// Update a route
router.put('/:id', RouteCrudController.update);

// Delete a route
router.delete("/:id", RouteCrudController.delete);

module.exports = router;