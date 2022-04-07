const express = require('express');
const router = express.Router();

const followController = require ('../controllers/follow.controller')

router.get('/:id', followController.follows);

router.post('/:id', followController.follow);

module.exports = router;