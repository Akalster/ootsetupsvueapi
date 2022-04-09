const express = require('express');
const router = express.Router();

const followController = require ('../controllers/follow.controller')

router.get('/:id', followController.follows);

router.get('/followdeep/:id', followController.followdeep);

router.post('/:id', followController.follow);

router.delete('/:id', followController.unfollow);

module.exports = router;