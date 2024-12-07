const express = require('express');
const router = express.Router();
const { getProductsInCategory, getCategoryById } = require('../controllers/categoriesController');
const { getProductsByID } = require ('../controllers/productsController');
const { registerUser,loginUser } = require('../controllers/authController'); 
const { addToCart, getCart, checkout, eliminateItem } = require('../controllers/cartController');



// Corrected routes with dynamic id
router.get('/category/:id', getCategoryById); // Get category by id
router.get('/category/:id/products', getProductsInCategory); // Get products by category id
router.get('/product/:id', getProductsByID);
router.post('/api/register', registerUser); // User registration route
router.post('/api/login', loginUser);       // User login route
router.post('/cart/add', addToCart);
router.get('/cart', getCart);
router.get('/cart/checkout', checkout);
router.patch('/cart/remove/:productId',eliminateItem) , 


module.exports = router;
