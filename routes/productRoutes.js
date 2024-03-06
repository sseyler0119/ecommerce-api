const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');
const {createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, uploadImage} = require('../controllers/productController');
const {getSingleProductReviews} = require('../controllers/reviewController');

// createProduct is only accessible to admin and must be authenticated, getAllProducts is accessible to everyone
router.route('/').post([authenticateUser, authorizePermissions('admin')], createProduct).get(getAllProducts)

router // must be above the ('/:id) route
  .route('/uploadImage')
  .post([authenticateUser, authorizePermissions('admin')], uploadImage);

router
  .route('/:id')
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions('admin')], updateProduct)
  .delete([authenticateUser, authorizePermissions('admin')], deleteProduct);

router.route('/:id/reviews').get(getSingleProductReviews)

module.exports = router;