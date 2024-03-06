const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {createTokenUser, attachCookiesToResponse, checkPermissions} = require('../utils');

const getAllUsers = async (req, res) => {
  console.log(req.user);
  // get all users, remove the password from response
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select('-password');
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${req.params.id} found`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
// update user with user.save()
const updateUser = async (req, res) => {
     const { email, name } = req.body;
     if (!email || !name) {
       throw new CustomError.BadRequestError('Please provide name and email');
     }
     
     const user = await User.findOne({_id: req.user.userId});
     user.email = email;
     user.name = name;

     await user.save();

     const tokenUser = createTokenUser(user);
     attachCookiesToResponse({ res, user: tokenUser });
     res.status(StatusCodes.OK).json({ user: tokenUser });
}
/* old method that does not use user.save()
const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError('Please provide name and email');
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { email, name },
    { new: true, runValidators: true }
  );
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({res, user: tokenUser});
  res.status(StatusCodes.OK).json({user: tokenUser});
};
*/
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      'Please provide both old and new password values'
    );
  }
  const user = await User.findOne({ _id: req.user.userId });
  /* we don't have a way to delete a user, so we are not checking for the existence of a user
    since we know the user exists */
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid credentials');
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'password updated' });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
