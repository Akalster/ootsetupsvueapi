const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const getModel = require('./model_cache')

const StepSchema = require('./step.model').Schema;

// define the product schema
const RouteSchema = new Schema({
    title: {
        type: String,
        required: [true, 'A route needs a title.']
    },
    description: {
        type: String,
        required: [true, 'A route needs a description.']
    },
    current: {
        type: Boolean,
        required: [true, 'A route needs to have current boolean.']
    },
    publishDate: {
        type: Date,
        required: [true, 'A route needs a date.'],
        validate: {
            validator: (publishDate) => publishDate <= new Date(),
            message: 'A route cannot be made in the future.'
        }
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'A route needs to be created by a user.']
    }
});

RouteSchema.plugin(require('mongoose-autopopulate'));

// export the route model through a caching function
module.exports = getModel('Route', RouteSchema)