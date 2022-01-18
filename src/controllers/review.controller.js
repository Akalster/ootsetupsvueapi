const Review = require("../models/review.model")();

async function getOpen(req, res) {
  const reviews = await Review.find({ open: true });
  res.status(200).send(reviews);
}

async function getClosed(req, res) {
  const reviews = await Review.find({ open: false });
  res.status(200).send(reviews);
}

async function getMyReviews(req, res) {
  const reviews = await Review.find({ createdBy: req.params.id });
  res.status(200).send(reviews);
}

module.exports = {
  getOpen,
  getMyReviews,
  getClosed
};
