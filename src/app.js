const express = require('express');
const cors = require('cors');  // Import cors
const app = express();
const { getCategoryById, getProductsInCategory } = require('./controllers/categoryController');
const { getProductsByID } = require('./controllers/productsController');
const {registerUser,loginUser} = require ('./controllers/authController');
const { addToCart, getCart, checkout, eliminateItem } = require('./controllers/cartController');
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

app.post('/api/register', registerUser); 
app.post('/api/login', loginUser);

app.post('/cart/add', addToCart);
app.get('/cart', getCart);
app.post('/cart/checkout', checkout);
app.patch('/cart/remove',eliminateItem) , 




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
