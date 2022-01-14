const express = require('express');
const router = express.Router();

const Team = require('../models/team.model')();

const CrudController = require('../controllers/crud');

const TeamController = require("../controllers/team.controller")
const TeamCrudController = new CrudController(Team);

// Get all teams
router.get('/', TeamCrudController.getAll);

// Get a team
router.get('/:id', TeamCrudController.getOne);

// Create a team
router.post('/', TeamController.create);

// Add user to team
router.put('/addUser', TeamController.addUser)

// Remove user from team
router.put('/removeUser', TeamController.removeUser)

// Update a team
router.put('/:id', TeamController.update);

// Remove a team
router.delete("/:id", TeamController.remove);

module.exports = router;