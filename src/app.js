const express = require('express');
const cors = require('cors');  // Import cors
const app = express();
const { getCategoryById, getProductsInCategory } = require('./controllers/categoryController');
const { getProductsByID, getProductsByName } = require('./controllers/productsController');
const {registerUser,loginUser, updateUser} = require ('./controllers/authController');
const { addToCart, getCart, checkout, eliminateItem } = require('./controllers/cartController');
const {getProductsByIDAdmin, getProducts, getCategories, addProduct, modifyProduct, removeProduct} = require('./controllers/adminController')
const port = 3000;

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

app.get('/api/products/search', async (req, res) => {
  try {
    const query = req.query.query;
    const products = await getProductsByName(query);
    res.json(products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post('/api/register', registerUser); 
app.post('/api/login', loginUser);
app.post('/api/update', updateUser);
app.post('/admin/product/add', addProduct);
app.post('/admin/product/modify', modifyProduct);
app.delete('/admin/product/remove', removeProduct);
app.post('/cart/add', addToCart);
app.get('/cart', getCart);
app.post('/cart/checkout', checkout);
app.patch('/cart/remove',eliminateItem) , 




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
