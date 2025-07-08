import express from 'express';
import pool from '../models/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { items } = req.body; // items: [{ product_id, quantity }]
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order items required' });
  }
  try {
    // Calculate total
    let total = 0;
    for (const item of items) {
      const productRes = await pool.query('SELECT price, stock FROM products WHERE id = $1', [item.product_id]);
      if (productRes.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
      if (productRes.rows[0].stock < item.quantity) return res.status(400).json({ message: 'Insufficient stock' });
      total += parseFloat(productRes.rows[0].price) * item.quantity;
    }
    // Create order
    const orderRes = await pool.query('INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id, created_at, total', [userId, total]);
    const orderId = orderRes.rows[0].id;
    // Insert order items and update stock
    for (const item of items) {
      const productRes = await pool.query('SELECT price, stock FROM products WHERE id = $1', [item.product_id]);
      await pool.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)', [orderId, item.product_id, item.quantity, productRes.rows[0].price]);
      await pool.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]);
    }
    res.status(201).json({ order_id: orderId, total });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order history for user
router.get('/history', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const ordersRes = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    const orders = ordersRes.rows;
    for (const order of orders) {
      const itemsRes = await pool.query('SELECT oi.*, p.name, p.image_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1', [order.id]);
      order.items = itemsRes.rows;
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 