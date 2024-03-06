const express = require('express');
const router = express.Router();
const {authenticateUser, authorizePermissions} = require('../middleware/authentication');
const { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword } = require('../controllers/userController');

// order matters here: we want to authenticate the user before we authorize permissions
router.route('/').get(authenticateUser, authorizePermissions('admin', 'owner') ,getAllUsers);
/* the next 3 routes must be above /:id to make sure these routes are hit. If they 
 are below the /:id route, Express will assume that is the user we want to see, modify, etc so these routes
 must come first  */
 router.route('/showMe').get(authenticateUser,showCurrentUser); 
 router.route('/updateUser').patch(authenticateUser, updateUser)
 router.route('/updateUserPassword').patch(authenticateUser ,updateUserPassword)
 router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;
