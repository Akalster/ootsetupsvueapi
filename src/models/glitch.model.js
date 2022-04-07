const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const getModel = require('./model_cache')

const GlitchSchema = new Schema({
    name: {
        type: String,
        required: [true, 'A glitch needs a name.']
    },
    
    description: {
        type: String,
        required: [true, 'A glitch needs a description.']
    },
    
    publishDate: {
        type: Date,
        required: [true, 'A glitch needs a date.'],
        validate: {
            validator: (publishDate) => publishDate <= new Date(),
            message: 'A glitch cannot be made in the future.'
        }
    },
    
    link: {
        type: String,
        required: [true, 'A glitch needs a youtube link.'],
        pattern: "^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$"
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: [true, "A glitch needs to be created by a user."]
    }
});

GlitchSchema.plugin(require('mongoose-autopopulate'));

// when a user is deleted all their reviews need to be deleted
// note: use an anonymous function and not a fat arrow function here!
// otherwise 'this' does not refer to the correct object
// use 'next' to indicate that mongoose can go to the next middleware
// GlitchSchema.pre('remove', function(next) {
//     // include the product model here to avoid cyclic inclusion
//     const Step = mongoose.model('Step')

//     // don't iterate here! we want to use mongo operators!
//     // this makes sure the code executes inside mongo
//     Step.updateMany({}, {$pull: {'steps': {'glitch': this._id}}})
//         .then(() => next())
// })

// export the glitch model through a caching function
module.exports = getModel('Glitch', GlitchSchema)