import express from 'express';
import pool from '../models/db.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'villasur-ecommerce/server/uploads/comprobantes'));
  },
  filename: function (req, file, cb) {
    // Nombre: comprobante-<order_id>-timestamp.ext
    const ext = path.extname(file.originalname);
    const orderId = req.body.order_id || 'unknown';
    cb(null, `comprobante-${orderId}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

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

// Subida de comprobante de pago Yape
router.post('/comprobante', authenticateToken, upload.fields([
  { name: 'comprobante', maxCount: 1 },
  { name: 'order_id', maxCount: 1 }
]), async (req, res) => {
  const file = req.files && req.files.comprobante ? req.files.comprobante[0] : null;
  const order_id = req.body.order_id;
  const userId = req.user.id;
  if (!file) {
    return res.status(400).json({ message: 'No se subió ningún archivo.' });
  }
  if (!order_id) {
    return res.status(400).json({ message: 'Falta el ID de la orden.' });
  }
  try {
    // Verificar que la orden pertenezca al usuario
    const orderRes = await pool.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [order_id, userId]);
    if (orderRes.rows.length === 0) {
      return res.status(403).json({ message: 'No tienes permiso para modificar esta orden.' });
    }
    // Actualizar la orden con la ruta del comprobante
    await pool.query('UPDATE orders SET comprobante = $1 WHERE id = $2', [file.filename, order_id]);
    res.json({ message: 'Comprobante recibido y guardado.', file: file.filename });
  } catch (err) {
    res.status(500).json({ message: 'Error al guardar el comprobante.' });
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

// Obtener todas las órdenes (solo admin)
router.get('/all', authenticateToken, async (req, res) => {
  // Verificar que el usuario sea admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Solo administradores pueden ver todas las órdenes.' });
  }
  try {
    const ordersRes = await pool.query(`
      SELECT o.*, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json(ordersRes.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener las órdenes.' });
  }
});

export default router; 