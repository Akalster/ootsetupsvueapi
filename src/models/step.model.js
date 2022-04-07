const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const getModel = require('./model_cache')

// define the product schema
const StepSchema = new Schema({
    stepnumber: {
        type: Number,
        required: [true, 'A step needs a name.'],
        validate: {
            validator: (stepnumber) => stepnumber > 0,
            message: 'A stepnumber needs to be positive.'
        }
    },

    description: {
        type: String,
        required: [true, 'A step needs a description.']
    },

    glitch: {
        type: Schema.Types.ObjectId,
        ref: 'glitch'
    },

    route: {
        type: Schema.Types.ObjectId,
        ref: 'route',
        required: [true, "A step needs to have a route."]
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'A step needs to be created by a user.']
    }
});

StepSchema.plugin(require('mongoose-autopopulate'));

// when a user is deleted all their reviews need to be deleted
// note: use an anonymous function and not a fat arrow function here!
// otherwise 'this' does not refer to the correct object
// use 'next' to indicate that mongoose can go to the next middleware
// StepSchema.pre('remove', function(next) {
    // include the product model here to avoid cyclic inclusion
    // const Route = mongoose.model('Route')

    // don't iterate here! we want to use mongo operators!
    // this makes sure the code executes inside mongo
//     Route.updateMany({}, {$pull: {'routes': {'step': this._id}}})
//         .then(() => next())
// })

// export the step model through a caching function
module.exports = getModel('Step', StepSchema)