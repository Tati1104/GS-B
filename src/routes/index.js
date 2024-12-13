const express = require('express');
const router = express.Router();
const { getProductsInCategory, getCategoryById } = require('../controllers/categoriesController');
const { getProductsByID, getProductsByName } = require ('../controllers/productsController');
const { registerUser,loginUser, updateUser } = require('../controllers/authController'); 
const { addToCart, getCart, checkout, eliminateItem } = require('../controllers/cartController');



// Corrected routes with dynamic id
router.get('/category/:id', getCategoryById); // Get category by id
router.get('/category/:id/products', getProductsInCategory); // Get products by category id
router.get('/product/:id', getProductsByID);
router.get('/api/products/search', getProductsByName);
router.post('/api/register', registerUser); // User registration route
router.post('/api/login', loginUser);       // User login route
router.post('/cart/add', addToCart);
router.get('/cart', getCart);
router.get('/cart/checkout', checkout);
router.patch('/cart/remove',eliminateItem) , 
router.post('/api/update', updateUser),

module.exports = router;
