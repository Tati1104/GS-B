const express = require('express');
const router = express.Router();
const { getProductsInCategory, getCategoryById } = require('../controllers/categoriesController');
const { getProductsByID, getProductsByName } = require ('../controllers/productsController');
const { registerUser,loginUser, updateUser } = require('../controllers/authController'); 
const { addToCart, getCart, checkout, eliminateItem } = require('../controllers/cartController');
const {getProducts, getCategories, addProduct, modifyProduct, removeProduct} =require('../controllers/adminController')



// Corrected routes with dynamic id
router.get('/category/:id', getCategoryById); // Get category by id
router.get('/category/:id/products', getProductsInCategory); // Get products by category id



router.get('/product/:id', getProductsByID);



router.get('/api/products/search', getProductsByName);
      // User login route




router.post('/admin/product/add', addProduct)
router.get ('/admin/products', getProducts);
router.get ('/admin/categories', getCategories);
router.post('/admin/product/modify', modifyProduct)
router.delete('/admin/product/remove', removeProduct);




router.post('/cart/add', addToCart);
router.get('/cart', getCart);
router.get('/cart/checkout', checkout);
router.patch('/cart/remove',eliminateItem) , 


router.post('/api/register', registerUser); // User registration route
router.post('/api/login', loginUser); 
router.post('/api/update', updateUser),

module.exports = router;
