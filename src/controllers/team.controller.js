const Team = require('../models/team.model')();
const errors = require('../errors');

const User = require('../models/user.model')()

const jwt = require("jsonwebtoken");

async function create(req, res) {
    if(req.headers.authorization == null){
        res.status(403).send({ message: "Not authorized" });
        return;
    }
    const users = [];
    const userIds = req.body.users;

    var existing = await Team.findOne({ name: req.body.name }).exec();

    if(existing){
        res.status(409).send({ message: "This team already exists!"})
        return;
    }

    if(userIds != undefined){
        userIds.map((element) => {
            users.push(User.find({ _id: element}).exec())
        })
    }

    Promise.all(users).then(async result => {
        var teamProps = {
            "name": req.body.name,
            "description": req.body.description,
            "createdBy": jwt.decode(req.headers.authorization.split(" ")[1]).id
        }

        const team = new Team(teamProps);

        if(result.length > 0){
            result.forEach(async user => {
                team.users.push(user[0])
                var updateUser = await User.findById(user[0]._id)
                updateUser.team = team._id;
                updateUser.save();
            });
        }

        await team.save();

        res.status(201).json(team);
    })
}

async function addUser(req, res) {
    if(req.headers.authorization == null){
        res.status(403).send({ message: "Not authorized" });
        return;
    }
    const userId = req.body.userId;
    const teamId = req.body.teamId;
    
    var decodedToken = jwt.decode(req.headers.authorization.split(" ")[1])

    var team = await Team.findOne({ _id: teamId }).exec();

    if(team.createdBy != decodedToken.id){
        res.status(403).send({ message: "You are not allowed to change this team!"});
        return;
    }

    var user = await User.findById(userId).exec();

    if(team == null || user == null){
        team == null ? res.status(400).send({ message: "Team could not be found"}) : res.status(400).send({ message: "User could not be found" });
        return;
    }

    if(team.users.some(q => q._id == userId)){
        res
            .status(400)
            .send({ message: "This user is already in the team!" });
          return;
    }else{
        user.team = teamId;
        user.save();
        team.users.push(user);
        team.save();

        res.status(200).send(team);
    }
}

async function removeUser(req, res){
    if(req.headers.authorization == null){
        res.status(403).send({ message: "Not authorized" });
        return;
    }
    const userId = req.body.userId;
    const teamId = req.body.teamId;

    var team = await Team.findOne({ _id: teamId }).exec();
    var user = await User.findById(userId).exec();

    if(team == null || user == null){
        team == null ? res.status(400).send({ message: "Team could not be found"}) : res.status(400).send({ message: "User could not be found" });
        return;
    }

    if(team.users.some(q => q._id == userId)){
        var filtered = team.users.filter(q => q._id != userId);

        var updated = {
            "name": team.name,
            "description": team.description,
            "users": filtered
        }

        await Team.findByIdAndUpdate(team._id, updated).then((response) => {
            res.status(200).send(updated);
        })
    }else{
        res
        .status(400)
        .send({ message: "This user is not in the team!" });
    }
}

async function update(req, res){
    if(req.headers.authorization == null){
        res.status(403).send({ message: "Not authorized" });
        return;
    }
    var updatedProps = {
        "name": req.body.name,
        "description": req.body.description
    }

    var team = await Team.findById(req.params.id);

    if(team.createdBy.valueOf() == req.user.id){
        await Team.findByIdAndUpdate(team._id, updatedProps)
        res.status(200).send(updatedProps);
    }else{
        res.status(401).send({message: "Not authorized!"})
    }
}

async function remove(req, res){
    if(req.headers.authorization == null){
        res.status(403).send({ message: "Not authorized" });
        return;
    }

    var decodedToken = jwt.decode(req.headers.authorization.split(" ")[1])

    var team = await Team.findById(req.params.id);
    var user = await User.findById(decodedToken.id)

    if(team.createdBy.valueOf() == decodedToken.id){
        await Team.findByIdAndDelete(team._id)
        user.team = null;
        user.save();
        res.status(200).send({message: "Team has been succesfully deleted"});
    }else{
        res.status(401).send({message: "Not authorized!"})
    }
}

module.exports = {
    create,
    addUser,
    removeUser,
    update,
    remove
}