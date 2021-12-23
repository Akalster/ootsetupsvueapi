const expressJwt = require('express-jwt');

const User = require('./src/models/user.model')(); // note we need to call the model caching function

module.exports = jwt;

function jwt() {
    const baseURL = '/api/';
    const secret = 'secret';
    //Uitwerking van nosql, met meer routes dit aanpassen
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            baseURL + 'auth/login',
            baseURL + 'auth/register',
            baseURL + 'users',
            { url: /^\/api\/users\/.*/, methods: ['GET'] },
        ],
    });
}

async function isRevoked(req, payload, done) {
    const user = await User.findById(payload.id);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
}
