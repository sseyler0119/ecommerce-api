const jwt = require('jsonwebtoken');

// if you set up your functions to take {}, you don't need to worry
// about the order of parameters as you pass them in
const createJWT = ({payload}) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
    return token;
}

const isTokenValid = ({token}) => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = ({res, user}) => {
  const token = createJWT({ payload: user }); // create token
  const oneDay = 1000 * 60 * 60 * 24; // in ms
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
}

module.exports = {createJWT, isTokenValid, attachCookiesToResponse}

