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
    // // check whether request is valid
    // if(!req.body.user) {
    //     throw new errors.EntityNotFoundError('User is required to purchase a product')
    // }

    // // get the product from the db and check whether we have such a product
    // const product = await Product.findById(req.params.id)
    // if(!product) {
    //     throw new errors.EntityNotFoundError(`Product with id '${req.params.id}' not found`)
    // }

    // // add the product to the bought list of the user
    // const user = await User.findOne({name: req.body.user})

    // // maybe not necessary any more now that we store it in neo?
    // // BEWARE: atomicity issues!
    // user.bought.push(product._id)
    // await user.save()

  

    // res.status(201).end()
    const userProps = req.body;
    const user = await User.findOne({ email: userProps.email });

    if (user && bcrypt.compareSync(userProps.password, user.password)) {
      const token = jwt.sign({ id: user._id }, "secret", {
        expiresIn: "7d"
      });
      user.token = token;
      res.status(201).send(user);
    } else {
        throw new errors.EntityNotFoundError('There is no account with registerd email')
    }
}

module.exports = {
    login,
    register
}
