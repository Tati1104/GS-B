const pool = require('../config/database'); // Import your database connection

// Fetch category by ID
const getCategoryById = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id, 10); // Parse the ID to an integer
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
    // Query the database
    const result = await pool.query(
      'SELECT "Name" FROM "Categories" WHERE "ID" = $1',
      [categoryId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Send the response
    res.json({ name: result.rows[0].Name });
  } catch (error) {
    console.error('Error fetching category:', error.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to get products for a category (including child categories)
const getProductsInCategory = async (req, res) => {
const categoryId = parseInt(req.params.id, 10); // Parse the ID to an integer
if (isNaN(categoryId)) {
    return res.status(400).json({ error: 'Invalid category ID' });
}
  const query = `
    SELECT p."ID", p."Name", p."Description", p."Price", p."INDls", p."Stock" 
    FROM "Products" AS p
    JOIN "Products-Categories" AS pc ON p."ID" = pc."ID-Product"
    WHERE pc."ID-Category" = $1;
  `;

  const products = await pool.query(query, [categoryId]);

  // Get all child categories for the given category
  const childCategories = await getChildCategories(categoryId);

  // Add products from child categories
  for (let childCategory of childCategories) {
    const childProducts = await pool.query(query, [childCategory.id]);
    products.rows = [...products.rows, ...childProducts.rows];
  }

  return products.rows;
}

// Function to get all child categories recursively
async function getChildCategories(categoryId) {
  const result = await pool.query('SELECT "ID" FROM "Categories" WHERE "ParentID" = $1', [categoryId]);
  let childCategories = result.rows;

  // For each child category, recursively get its children
  for (let category of childCategories) {
    const children = await getChildCategories(category.id);
    childCategories = [...childCategories, ...children];
  }

  return childCategories;
}

module.exports = {
  getCategoryById,
  getProductsInCategory,
};
