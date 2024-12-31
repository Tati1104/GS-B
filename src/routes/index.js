const express = require('express');
const router = express.Router();
const { getProductsInCategory, getCategoryById } = require('../controllers/categoriesController');
const { getProductsByID, getProductsByName, getProductImageByID, getProductImagesByID } = require ('../controllers/productsController');
const { registerUser,loginUser, updateUser } = require('../controllers/authController'); 
const { addToCart, getCart, checkout, eliminateItem } = require('../controllers/cartController');
const {getProducts, getCategories, addProduct, modifyProduct, removeProduct, getProductsOnSale, addProducttoSales, deleteProducttoSales, getProductsCategories, addProducttoCategory, removeProductofCategory, getFinishedOrders, modifyProductImages} =require('../controllers/adminController')
const multer = require('multer');
const upload = multer({ dest: 'uploads/products' });


// Corrected routes with dynamic id
router.get('/category/:id', getCategoryById); // Get category by id
router.get('/category/:id/products', getProductsInCategory); // Get products by category id



router.get('/product/:id', getProductsByID);



router.get('/api/products/search', getProductsByName);
      // User login route
router.get('/product/image/:id', getProductImageByID);

router.get('/product/images/:id', getProductImagesByID);




router.post('/admin/product/add',upload.array('images', 10), addProduct)
router.post('/admin/product/modify/images',upload.array('images', 10), modifyProductImages);
router.get ('/admin/products', getProducts);
router.get ('/admin/categories', getCategories);

router.get('/admin/orders/finished', getFinishedOrders)



router.post('/admin/product/modify', modifyProduct)
router.delete('/admin/product/remove', removeProduct);
router.get('/admin/products/categories', getProductsCategories)
router.post('/admin/products/categories/add', addProducttoCategory)
router.delete('/admin/products/categories/delete', removeProductofCategory)


router.get('/admin/sale', getProductsOnSale);
router.post('/admin/sale/add', addProducttoSales);
router.delete('/admin/sale/delete', deleteProducttoSales);



router.post('/cart/add', addToCart);
router.get('/cart', getCart);
router.get('/cart/checkout', checkout);
router.patch('/cart/remove',eliminateItem) , 


router.post('/api/register', registerUser); // User registration route
router.post('/api/login', loginUser); 
router.post('/api/update', updateUser),

module.exports = router;
