const CustomError = require('../errors');

const checkPermissions = (requestUser, resourceUserId) => {
   // console.log(requestUser, resourceUserId, typeof(resourceUserId)); // for testing
   if(requestUser.role === 'admin') return;
   if(requestUser.userId === resourceUserId.toString()) return; // userId is same as the id being viewed
   throw new CustomError.UnauthorizedError(`Not authorized to access this route`)
}

module.exports = checkPermissions;