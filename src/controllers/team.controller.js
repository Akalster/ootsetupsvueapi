const Team = require('../models/team.model')();
const errors = require('../errors');

const User = require('../models/user.model')()

async function create(req, res) {
    const users = [];
    const userIds = req.body.users;

    var existing = await Team.findOne({ name: req.body.name }).exec();

    if(existing){
        res.status(409).send({ message: "This team already exists!"})
        return;
    }

    userIds.map((element) => {
        users.push(User.find({ _id: element}).exec())
    })

    Promise.all(users).then(async result => {
        var teamProps = {
            "name": req.body.name,
            "description": req.body.description,
            "createdBy": req.body.createdBy
        }

        const team = new Team(teamProps);
        
        result.forEach(user => {
            team.users.push(user[0])
        });

        await team.save();

        res.status(201).json(team);
    })
}

async function addUser(req, res) {
    const userId = req.body.userId;
    const teamId = req.body.teamId;

    var team = await Team.findOne({ name: teamId }).exec();
    var user = await User.findById(userId).exec();

    if(team == null || user == null){
        team == null ? res.status(400).send({ message: "Team could not be found"}) : res.status(400).send({ message: "User could not be found" });
        return;
    }

    if (team.users.every((element) => {
        if (element._id == userId) {
          res
            .status(400)
            .send({ message: "This user already is in the team!" });
          return false;
        }
        return true;
      })) {
        team.users.push(user);
        team.save();

        res.status(200).send(team);
    }
}

async function removeUser(req, res){
    const userId = req.body.userId;
    const teamId = req.body.teamId;

    var team = await Team.findOne({ name: teamId }).exec();
    var user = await User.findById(userId).exec();

    if(team == null || user == null){
        team == null ? res.status(400).send({ message: "Team could not be found"}) : res.status(400).send({ message: "User could not be found" });
        return;
    }

    var exists = false;

    team.users.forEach((element) => {
        if (element._id != userId) {
            exists = false;
        }else{
            exists = true;
        }
      })

    if(exists){
        var filtered = team.users.filter(q => q._id != userId);

        var updated = {
            "name": teamId,
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

module.exports = {
    create,
    addUser,
    removeUser,
    update
}