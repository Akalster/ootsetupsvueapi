const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AnswerSchema = require('./answer.model');

const getModel = require('./model_cache');

const QuestionSchema = new Schema({
    reviewkey: {
        type: Schema.Types.ObjectId,
        ref: 'review',
        required: [true, 'A question needs to have a reviewkey.'],
    },

    //Open voor verandering, bespreken met iedereen.
    type: {
        type: String,
        required: [true, 'A question needs to have a type.'],
    },

    answers:{
        type:[AnswerSchema.AnswerSchema]
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'A question needs to be created by a user.']
    }
});

// mongoose plugin to always populate fields
QuestionSchema.plugin(require('mongoose-autopopulate'));

// when a user is deleted all their questions need to be deleted
// note: use an anonymous function and not a fat arrow function here!
// otherwise 'this' does not refer to the correct object
// use 'next' to indicate that mongoose can go to the next middleware
// UserSchema.pre('remove', function(next) {
//     // include the product model here to avoid cyclic inclusion
//     const Product = mongoose.model('Product')

//     // don't iterate here! we want to use mongo operators!
//     // this makes sure the code executes inside mongo
//     Product.updateMany({}, {$pull: {'questions': {'user': this._id}}})
//         .then(() => next())
// })

// export the user model through a caching function
module.exports = getModel('Question', QuestionSchema);
