const pool = require('../config/database'); // Import your database connection
const path = require('path');
const JSZip = require('jszip');
const fs = require('fs');


// Fetch category by ID
const getProductsByID = async (req, res) => {
  try {
    const encodedProductID = req.params.id;
    const productID = decodeURIComponent(encodedProductID);
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

const getProductImageByID = async (req, res) => {
  try {
    const encodedProductID = req.params.id;
    const productID = decodeURIComponent(encodedProductID);
    const result = await pool.query(
      'SELECT p."product_id", p."image_path" FROM "product_images" AS p WHERE p."product_id" = $1',
      [productID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Construir la ruta absoluta al archivo
    const filePath = result.rows[0].image_path; // './uploads/products/4COMBGEN/2.jpg'
    const uploadsDir = path.resolve('./'); // Ruta raíz del proyecto
    const absolutePath = path.join(uploadsDir, filePath);
    res.sendFile(absolutePath);
  } catch (error) {
    console.error('Error fetching product:', error.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProductImagesByID = async (req, res) => {
    try {
      const encodedProductID = req.params.id;
      const productID = decodeURIComponent(encodedProductID);
      const result = await pool.query(
        'SELECT p."product_id", p."image_path" FROM "product_images" AS p WHERE p."product_id" = $1',
        [productID]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      const uploadsDir = path.resolve('./'); // Ruta raíz del proyecto
      const zip = new JSZip();
  
      // Agregar cada imagen al ZIP
      for (let row of result.rows) {
        const filePath = path.join(uploadsDir, row.image_path);
        const imageBuffer = fs.readFileSync(filePath);
        zip.file(path.basename(row.image_path), imageBuffer);
      }
  
      // Generar el archivo ZIP y enviarlo como respuesta
      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename=product_images_${productID}.zip`);
      res.send(zipBuffer);
  
    } catch (error) {
      console.error('Error fetching product images:', error.message || error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


const getProductsByName = async (req, res) => {
    try {
      const query = req.query.query.toLowerCase();
      const result = await pool.query(
        'SELECT * FROM "Products" WHERE LOWER("Name") LIKE $1',
        [`%${query}%`]
      );
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getProductsByID, getProductsByName, getProductImageByID, getProductImagesByID
  };
  