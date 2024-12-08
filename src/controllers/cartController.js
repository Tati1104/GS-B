const pool = require('../config/database');

// Agregar al carrito
const addToCart = async (req, res) => {
    const { productId, quantity, userId } = req.query;
    try {
        // Check if the user has an active cart (unfinished)
        const cartResult = await pool.query(
          'SELECT * FROM "cart" WHERE "user_id" = $1 AND "finished" = false LIMIT 1',
          [userId]
        );
    
        let cart;
        if (cartResult.rows.length === 0) {
          // If no active cart exists, create a new one
          const createCartResult = await pool.query(
            'INSERT INTO "cart" ("user_id", "finished") VALUES ($1, $2) RETURNING "id"',
            [userId, false]
          );
          cart = createCartResult.rows[0];
        } else {
          cart = cartResult.rows[0];
        }
    
        // Check if the product already exists in the cart
        const cartItemResult = await pool.query(
          'SELECT * FROM "cart_items" WHERE "cart_id" = $1 AND "product_id" = $2 LIMIT 1',
          [cart.id, productId]
        );
    
        // Get product details to get the price
        const productResult = await pool.query(
          'SELECT "Price", "Name" FROM "Products" WHERE "ID" = $1 LIMIT 1',
          [productId]
        );
    
        if (productResult.rows.length === 0) {
          return res.status(404).json({ message: 'Producto no encontrado' });
        }
    
        const price = productResult.rows[0].Price;
        const name = productResult.rows[0].Name
    
        let cartItem;
        if (cartItemResult.rows.length > 0) {
          // If the product already exists in the cart, update the quantity and total
          cartItem = cartItemResult.rows[0];
          const updatedQuantity = cartItem.quantity + 1;
    
          await pool.query(
            'UPDATE "cart_items" SET "quantity" = $1 WHERE "id" = $2',
            [updatedQuantity, cartItem.id]
          );
        } else {
          // If the product doesn't exist in the cart, add a new item
          await pool.query(
            'INSERT INTO "cart_items" ("cart_id", "product_id", "quantity", "price", "name") VALUES ($1, $2, $3, $4, $5)',
            [cart.id, productId, quantity, price, name]
          );
        }
    
        res.status(200).json({ message: 'Producto agregado al carrito' });
      } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error al agregar producto al carrito' });
      }
    };
    

    const getCart = async (req, res) => {
        const { userId } = req.query;
        try {
          // Query to find the most recent unfinished cart for the user
          const cartResult = await pool.query(
            'SELECT * FROM "cart" WHERE "user_id" = $1 AND "finished" = false ORDER BY "created_at" DESC LIMIT 1',
            [userId]
          );
      
          if (cartResult.rows.length === 0) {
            return res.status(404).json({ message: 'No tienes un carrito activo' });
          }
      
          const cart = cartResult.rows[0];
      
          // Query to get all cart items for the active cart
          const cartItemsResult = await pool.query(
            'SELECT ci.*, p."ID", p."Name", p."Price" FROM "cart_items" ci JOIN "Products" p ON ci."product_id" = p."ID" WHERE ci."cart_id" = $1',
            [cart.id]
          );
      
          const cartItems = cartItemsResult.rows.map(item => ({
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
            name: item.name,
          }));
      
          res.status(200).json(cartItems);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error al obtener el carrito' });
        }
      };
      

// Ruta para marcar el carrito como comprado (finalizar la compra)
const checkout = async (req, res) => {
    const {  userId } = req.query;
  
    try {
      // Query to find the most recent unfinished cart for the user
      const cartResult = await pool.query(
        'SELECT * FROM "cart" WHERE "user_id" = $1 AND "finished" = false ORDER BY "created_at" DESC LIMIT 1',
        [userId]
      );
  
      if (cartResult.rows.length === 0) {
        return res.status(404).json({ message: 'No tienes un carrito activo' });
      }
  
      const cart = cartResult.rows[0];
  
      // Update the cart to mark it as finished
      await pool.query(
        'UPDATE "cart" SET "finished" = true WHERE "id" = $1',
        [cart.id]
      );
  
      res.status(200).json({ message: 'Carrito finalizado y comprado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al finalizar la compra' });
    }
  };

  // Reducir o eliminar una cantidad específica de un producto del carrito
  const eliminateItem = async (req, res) => {
    const { productId, quantity, userId } = req.query;

    try {
      // Query to find the most recent unfinished cart for the user
      const cartResult = await pool.query(
        'SELECT * FROM "cart" WHERE "user_id" = $1 AND "finished" = false LIMIT 1',
        [userId]
      );
  
      if (cartResult.rows.length === 0) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }
  
      const cart = cartResult.rows[0];
  
      // Query to find the cart item by product ID
      const cartItemResult = await pool.query(
        'SELECT * FROM "cart_items" WHERE "cart_id" = $1 AND "product_id" = $2 LIMIT 1',
        [cart.id, productId]
      );
  
      if (cartItemResult.rows.length === 0) {
        return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
      }
  
      const cartItem = cartItemResult.rows[0];
  
      if (quantity >= cartItem.quantity) {
        // If quantity to eliminate is equal or greater, remove the item from the cart
        await pool.query(
          'DELETE FROM "cart_items" WHERE "id" = $1',
          [cartItem.id]
        );
      } else {
        // If quantity to eliminate is smaller, reduce the quantity and update total
        const newQuantity = cartItem.quantity - quantity;
        const newTotal = cartItem.price * newQuantity;
  
        await pool.query(
          'UPDATE "cart_items" SET "quantity" = $1 WHERE "id" = $2',
          [newQuantity, cartItem.id]
        );
      }
  
      res.status(200).json({ message: 'Cantidad actualizada correctamente en el carrito' });
    } catch (error) {
      console.error('Error al actualizar el producto en el carrito:', error);
      res.status(500).json({ message: 'Error interno al actualizar el producto en el carrito' });
    }
  };

module.exports = { addToCart, getCart, checkout, eliminateItem };


    
  