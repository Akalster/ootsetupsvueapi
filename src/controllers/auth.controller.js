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

    if(!user){
      throw new errors.EntityNotFoundError('There is no account registered under this e-mail.')
    }

    const check = await bcrypt.compareSync(userProps.password, user.password);

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
