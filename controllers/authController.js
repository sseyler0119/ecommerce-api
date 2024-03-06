const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
// we will use CustomError.ErrorName to access each error in index.js
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email }); // find user with matching email

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  // create tokenUser attach cookie
  const tokenUser = createTokenUser(user)
  // attach cookies to response
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const register = async (req, res) => {
  const { email, name, password } = req.body;
  const duplicateEmail = await User.findOne({ email });
  if (duplicateEmail) {
    throw new CustomError.BadRequestError('Email already exists');
  }
  // first user registered as admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  // req.body.role would allow manual assignment, I want to only allow admins to assign roles
  const role = isFirstAccount ? 'admin' : 'user'; //req.body.role;
  const user = await User.create({ name, email, password, role });
  // issue token
  const tokenUser = createTokenUser(user);
  // attach cookies to response
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const logout = async (req, res) => {
    // set token cookie to empty string, can be any value
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg: 'user logged out'}) // dev testing
};

module.exports = { login, register, logout };
