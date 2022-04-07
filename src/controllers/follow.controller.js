const neo = require('../../neo');

const User = require('../models/user.model')();

const errors = require('../errors');

async function getFollows(query, req, res) {
    const session = neo.session();

    const result = await session.run(query, {
        userId: req.params.id,
    });

    const userIds = result.records[0].get('userIds');

    session.close();

    const follows = await User.find({_id: {$in: userIds}});

    res.status(200).json(follows);
}

async function follows(req, res) {
    await getFollows(neo.follows, req, res);
}

async function follow(req, res) {

    const user = await User.findById(req.user.id);

    if(!user) {
        throw new errors.EntityNotFoundError(`Current user ${req.user.id} not found`);
    }

    const followedUser = await User.findById(req.params.id);

    if(!followedUser) {
        throw new errors.EntityNotFoundError(`User with id ${req.params.id} not found`);
    }

    console.log(user._id + ' is trying to follow ' + followedUser._id);

    const session = neo.session();

    await session.run(neo.follow, {
        user2Id: followedUser._id.toString(),
        user1Id: user._id.toString(),
    });

    session.close();

    res.status(201).end();
    
}

module.exports = {
    follows,
    follow,
}