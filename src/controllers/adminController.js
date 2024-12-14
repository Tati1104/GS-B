

const pool = require('../config/database'); // Database connection
const bcrypt = require('bcryptjs');


const getProductsByIDAdmin = async (req, res) => {
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

const getProducts = async (req, res) => {
    try {
      const result = await pool.query(
          'SELECT * FROM "Products"'
        );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching products:', error.message || error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const addProduct = async (req, res) => {
    const { id, name, description, price, stock, indls, categories } = req.query;
    try {
      // Verifica si 'categories' es un array y contiene números
      let processedCategories = categories;
        if (typeof categories === 'string') {
        processedCategories = categories.split(',').map((cat) => parseInt(cat.trim(), 10));
        }
        // Verifica que el array contiene números válidos
        if (!Array.isArray(processedCategories) || !processedCategories.every((cat) => !isNaN(cat))) {
        return res.status(400).json({ error: "Invalid 'categories' format. It must be an array of numbers." });
        }
      // Guardar el producto en la base de datos
      await pool.query(
        'INSERT INTO "Products" ("ID", "Name", "Description", "Price", "INDls", "Stock") VALUES ($1, $2, $3, $4, $5, $6)',
        [id, name, description, price, indls, stock]
      );
  
      // Asociar categorías al producto
      for (const category of processedCategories) {
        await pool.query(
          'INSERT INTO "Products-Categories" ("ID-Product", "ID-Category") VALUES ($1, $2)',
          [id, category]
        );
      }
  
      res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
      console.error('Error during add:', error.message || error);
      res.status(500).json({ error: 'Internal server error during add' });
    }
  };
  


const modifyProduct = async (req,res) => {
    const id= req.query.id
    const name= req.query.name
    const description= req.query.description
    const price= req.query.price
    const stock= req.query.stock
    const indls= req.query.indls
    
    try {
        // Guardar el producto en la base de datos
        const result = await pool.query(
            'UPDATE "Products" SET "Name" = $2, "Description" = $3, "Price" = $4, "INDls" = $5, "Stock" = $6 WHERE "ID" = $1 RETURNING *',
            [id, name, description, price, indls, stock]
        );        
        res.status(201).json({ result });
    } catch (error) {
        console.error('Error during add:', error.message || error);
        res.status(500).json({ error: 'Internal server error during add' });
    }
};


const removeProduct = async (req, res) => {
    const { id } = req.query;
    try {
      const result = await pool.query(
        'DELETE FROM "Products" WHERE "ID" = $1',
        [id]
      );
      res.status(201).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error('Error during remove:', error.message || error);
      res.status(500).json({ message: 'Internal server error during remove' });
    }
  };
  

  const getCategories = async (req, res) => {
    try {
      const result = await pool.query(
          'SELECT * FROM "Categories"'
        );
      // Send the response
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching categories:', error.message || error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };



module.exports = {
    getProductsByIDAdmin, getProducts, getCategories, addProduct, modifyProduct, removeProduct
  };