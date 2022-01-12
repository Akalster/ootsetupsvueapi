const User = require('../models/user.model')() // note we need to call the model caching function

const errors = require('../errors')

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(req, res) {
    const userProps = req.body; 
    userProps.password = bcrypt.hashSync(userProps.password, 10);
    await User.create(userProps)
      .then(async user => {
        res.status(201).send(user).end()
      })
}

async function login(req, res) {
    const userProps = req.body;
    const user = await User.findOne({ email: userProps.email });

    if(!user){
      throw new errors.EntityNotFoundError('There is no account registered under this e-mail.')
    }

    const check = bcrypt.compare(userProps.password, user.password);

    if (user && check) {
      const token = jwt.sign({ id: user._id, firstName: user.firstname, lastName: user.lastname, email: user.email, team: user.team }, "secret", {
        expiresIn: "7d"
      });
      user.token = token;

      var expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      res.status(201).send({ 
        token: user.token,
        expirationDate: expirationDate
      });
    } else if(user && !check){
      throw new errors.EntityNotFoundError('The password was incorrect.')
    }
}

module.exports = {
    login,
    register
}
