const pool = require('../config/database'); // Import your database connection

// Fetch category by ID
const getProductsByID = async (req, res) => {
  try {
    const productID = req.params.id; // Parse the ID to an integer
    // Query the database
    const result = await pool.query(
        'SELECT p."ID", p."Name", p."Description", p."Price", p."INDls", p."Stock" FROM "Products" AS p WHERE p."ID" = $1 ',
        [productID] // Corrected this line
      );
      
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    // Send the response
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = {
    getProductsByID
  };
  