const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const getModel = require("./model_cache");

const ScaleAnswerSchema = new Schema({
  selectedScale: {
    type: String,
    required: [true, "An scale answer needs to have scales."]
  },

  content: {
    type: String
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: [true, "An answer needs to be made by a user."]
  },

  answeredDate: {
    type: Date,
    required: [true, "An open answer needs to have a date."]
  },

  questionId: {
    type: Schema.Types.ObjectId,
    ref: "question",
    required: [true, "An answer needs to be made for a question."]
  }
});

ScaleAnswerSchema.index({ createdBy: 1, questionId: 1 }, { unique: true });

// mongoose plugin to always populate fields
ScaleAnswerSchema.plugin(require("mongoose-autopopulate"));

// when a user is deleted all their answers need to be deleted
// note: use an anonymous function and not a fat arrow function here!
// otherwise 'this' does not refer to the correct object
// use 'next' to indicate that mongoose can go to the next middleware
// UserSchema.pre('remove', function(next) {
//     // include the product model here to avoid cyclic inclusion
//     const Product = mongoose.model('Product')

//     // don't iterate here! we want to use mongo operators!
//     // this makes sure the code executes inside mongo
//     Product.updateMany({}, {$pull: {'answers': {'user': this._id}}})
//         .then(() => next())
// })

// export the user model through a caching function
module.exports = getModel("ScaleAnswer", ScaleAnswerSchema);
