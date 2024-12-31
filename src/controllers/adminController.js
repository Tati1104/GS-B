

const pool = require('../config/database'); // Database connection
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const multer = require('multer');


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

const modifyProductImages = async (req, res) => {
  const { id } = req.query;
  try {
    // Procesar categoría

      // Convertir la cadena de imagenes en objetos File
      fs.mkdirSync(`uploads/products/${id}`, { recursive: true }); // Crear directorio si no existe
      req.files.map(file => saveImage(file, id));
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error during add:', error.message || error);
    res.status(500).json({ error: 'Internal server error during add' });
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
      // Procesar categorías
      let processedCategories = categories;
      if (typeof categories === 'string') {
        processedCategories = categories.split(',').map((cat) => parseInt(cat.trim(), 10));
      }
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
          'INSERT INTO "products_categories" ("id_product", "id_category") VALUES ($1, $2)',
          [id, category]
        );
      }
  
        // Convertir la cadena de imagenes en objetos File
        fs.mkdirSync(`uploads/products/${id}`, { recursive: true }); // Crear directorio si no existe
        req.files.map(file => saveImage(file, id));
      res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
      console.error('Error during add:', error.message || error);
      res.status(500).json({ error: 'Internal server error during add' });
    }
};

function saveImage(file, pid) {
  const newPath = `./uploads/products/${pid}/${file.originalname}`;
  fs.renameSync(file.path, newPath);
  pool.query(
    'INSERT INTO "product_images" ("product_id", "image_path") VALUES ($1, $2)',
    [pid, newPath]
  ).catch(error => console.error('Error inserting image into database:', error));
}
  
  


const modifyProduct = async (req,res) => {
    const id= req.query.id
    const name= req.query.name
    const description= req.query.description
    const price= req.query.price
    const stock= req.query.stock
    const indls= req.query.indls
    
    try {
        // Guardar el producto en la base de datos
        await pool.query(
            'UPDATE "Products" SET "Name" = $2, "Description" = $3, "Price" = $4, "INDls" = $5, "Stock" = $6 WHERE "ID" = $1',
            [id, name, description, price, indls, stock]
        );        
        res.status(201).json({ message: "Product modified correctly" });
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


  const getProductsOnSale = async (req,res) => {
    try {
      const id = 87;
      const result = await pool.query(
          'SELECT p."ID", p."Name", p."Price", p."INDls" FROM "Products" as p JOIN "products_categories" as c ON p."ID" = c."id_product" WHERE c."id_category" = $1',
          [id]
        );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching categories:', error.message || error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  

  const addProducttoSales = async (req,res) => {
    const {id} = req.query;
    try {
      const result = await pool.query(
          'INSERT INTO "products_categories" ("id_product", "id_category") VALUES ($1, 87)',
          [id]
      );
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error('Error during add:', error.message || error);
        res.status(500).json({ error: 'Internal server error during add' });
    }
  }

  const deleteProducttoSales = async (req,res) => {
    const {id} = req.query;
    try {
      const result = await pool.query(
          'DELETE FROM "products_categories" WHERE "id_product" = $1 AND "id_category" = 87',
          [id]
      );
        res.status(201).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error during delete:', error.message || error);
        res.status(500).json({ error: 'Internal server error during delete' });
    }
  }

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

  const getProductsCategories = async (req,res) =>{
    try {
      const result = await pool.query(
          'SELECT p."ID" AS product_id, p."Name" AS product_name, c2."Name" AS category_name, c2."ID" AS category_id  FROM "Products" AS p JOIN "products_categories" AS c ON p."ID" = c."id_product" JOIN "Categories" AS c2 ON c2."ID" = c."id_category" GROUP BY p."ID", p."Name", c2."Name", c2."ID"',
        );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching categories:', error.message || error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  const addProducttoCategory = async (req,res) => {
    const {idP} = req.query;
    const {idC} = req.query;

    try {
      await pool.query(
          'INSERT INTO "products_categories" ("id_product", "id_category") VALUES ($1, $2)',
          [idP, idC]
      );
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error('Error during add:', error.message || error);
        res.status(500).json({ error: error.message });
    }
  }

  const removeProductofCategory = async (req,res) => {
    const {idP, idC} = req.query;
    try {
      await pool.query(
          'DELETE FROM "products_categories" WHERE "id_product" = $1 AND "id_category" = $2',
          [idP, idC]
      );
        res.status(201).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error during delete:', error.message || error);
        res.status(500).json({ error: 'Internal server error during delete' });
    }
  }

  const getFinishedOrders = async (req,res) =>{
    try {
      const result = await pool.query(
          'SELECT c.id AS order_id,   FROM "cart" AS c JOIN "cart_items" AS ci ON c."id" = ci."cart_id" WHERE c."finished"=true GROUP BY c."id", c."user_id", ci.',
        );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching categories:', error.message || error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = {
    getProductsByIDAdmin, getProducts, getCategories, addProduct, modifyProduct, 
    removeProduct, getProductsOnSale, addProducttoSales, deleteProducttoSales, 
    getProductsCategories, addProducttoCategory, removeProductofCategory,
    getFinishedOrders, modifyProductImages
  };