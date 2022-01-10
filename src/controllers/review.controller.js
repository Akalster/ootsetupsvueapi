const Review = require('../models/review.model')();

async function getOpen(req, res) {
    const reviews = await Review.find()
    res.status(200).send(reviews);
}

module.exports = {
    getOpen
}