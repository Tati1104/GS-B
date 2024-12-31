const express = require('express');
const cors = require('cors');  // Import cors
const app = express();
const { getCategoryById, getProductsInCategory } = require('./controllers/categoryController');
const { getProductsByID, getProductsByName,getProductImageByID, getProductImagesByID } = require('./controllers/productsController');
const {registerUser,loginUser, updateUser} = require ('./controllers/authController');
const { addToCart, getCart, checkout, eliminateItem } = require('./controllers/cartController');
const {getProductsByIDAdmin, getProducts, getCategories, addProduct, modifyProduct, removeProduct, getProductsOnSale, addProducttoSales, deleteProducttoSales, getProductsCategories, addProducttoCategory, removeProductofCategory, getFinishedOrders, modifyProductImages} = require('./controllers/adminController')
const port = 3000;
const multer = require('multer');
const upload = multer({ dest: 'uploads/products' });


// Middleware
app.use(express.json());

// Move CORS middleware to the top
app.use((req, res, next) => {
    console.log('Incoming request headers:', req.headers);
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.options('*', cors());


// Route to get category name by ID
app.get('/category/id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categoryName = await getCategoryById(categoryId);
    res.json({ name: categoryName });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to get products by category (including child categories)
app.get('/category/id/products', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const products = await getProductsInCategory(categoryId);
    res.json({ products});
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/product/id', async (req, res) => {
  try {
    const productsID = req.params.id;
    const products = await getProductsByID(productsID);
    res.json(products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/product/image/id', async (req, res) => {
  try {
    const productsID = req.params.id;
    const products = await getProductImageByID(productsID);
    res.json(products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/product/images/id', async (req, res) => {
  try {
    const productsID = req.params.id;
    const products = await getProductImagesByID(productsID);
    res.json(products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


app.get('admin/product/id', async (req, res) => {
  try {
    const productsID = req.params.id;
    const products = await getProductsByIDAdmin(productsID);
    res.json(products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('admin/products', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('admin/categories', async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('admin/sale', async (req, res) => {
  try {
    const products = await getProductsOnSale();
    res.json(products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('admin/products/categories', async (req, res) => {
  try {
    const products = await getProductsCategories();
    res.json(products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/api/products/search', async (req, res) => {
  try {
    const query = req.query.query;
    const products = await getProductsByName(query);
    res.json(products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/admin/orders/finished', async (req, res) => {
  try {
    const orders = await getFinishedOrders();
    res.json(orders);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});



app.post('/api/register', registerUser); 
app.post('/api/login', loginUser);
app.post('/api/update', updateUser);


app.post('/admin/sale/add', addProducttoSales)
app.delete('/admin/sale/delete', deleteProducttoSales)

app.post('/admin/product/add', upload.array('images', 10), addProduct);
app.post('/admin/product/modify', modifyProduct);
app.post('/admin/product/modify/images',upload.array('images', 10), modifyProductImages);
app.delete('/admin/product/remove', removeProduct);

app.delete('/admin/products/categories/delete', removeProductofCategory)
app.post('/admin/products/categories/add', addProducttoCategory)


app.post('/cart/add', addToCart);
app.get('/cart', getCart);
app.post('/cart/checkout', checkout);
app.patch('/cart/remove',eliminateItem) , 




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
