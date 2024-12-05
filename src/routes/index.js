const express = require('express');
const router = express.Router();
const { getProductsInCategory, getCategoryById } = require('../controllers/categoriesController');


// Corrected routes with dynamic id
router.get('/category/:id', getCategoryById); // Get category by id
router.get('/category/:id/products', getProductsInCategory); // Get products by category id

module.exports = router;
