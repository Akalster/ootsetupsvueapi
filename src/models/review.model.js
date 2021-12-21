const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const getModel = require('./model_cache');

const ReviewSchema = new Schema({
    createdBy: {
        type: String,
    },

    title: {
        type: String,
        required: [true, 'A review needs to have a title.'],
    },

    open: {
        type: Boolean,
        required: [true, 'A review needs to be either open or not.'],
    },

    postdate: {
        type: Date,
        default: Date.now(),
    },
});

// mongoose plugin to always populate fields
ReviewSchema.plugin(require('mongoose-autopopulate'));

// when a user is deleted all their reviews need to be deleted
// note: use an anonymous function and not a fat arrow function here!
// otherwise 'this' does not refer to the correct object
// use 'next' to indicate that mongoose can go to the next middleware
// UserSchema.pre('remove', function(next) {
//     // include the product model here to avoid cyclic inclusion
//     const Product = mongoose.model('Product')

//     // don't iterate here! we want to use mongo operators!
//     // this makes sure the code executes inside mongo
//     Product.updateMany({}, {$pull: {'reviews': {'user': this._id}}})
//         .then(() => next())
// })

// export the user model through a caching function
module.exports = getModel('Review', ReviewSchema);
