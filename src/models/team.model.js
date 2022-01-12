const mongoose = require('mongoose');
const getModel = require('./model_cache');
const Schema = mongoose.Schema;
const UserSchema = require('./user.model');

const TeamSchema = new Schema({
    name: {
        type: String,
        required: [true, 'A team requires a name.']
    },

    description: {
        type: String
    },

    users: {
        type: [UserSchema.UserSchema]
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'A team needs to be created by a user.']
    }
});

TeamSchema.plugin(require('mongoose-autopopulate'));

module.exports = getModel('Team', TeamSchema);