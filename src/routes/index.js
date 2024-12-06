const express = require('express');
const router = express.Router();
const { getProductsInCategory, getCategoryById } = require('../controllers/categoriesController');
const { getProductsByID } = require ('../controllers/productsController');
const { registerUser,loginUser } = require('../controllers/authController'); 



// Corrected routes with dynamic id
router.get('/category/:id', getCategoryById); // Get category by id
router.get('/category/:id/products', getProductsInCategory); // Get products by category id
router.get('/product/:id', getProductsByID);
router.post('/api/register', registerUser); // User registration route
router.post('/api/login', loginUser);       // User login route
module.exports = router;
