import express from 'express';
import pool from '../models/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Middleware para verificar admin
function requireAdmin(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'No token provided' });
    const token = auth.split(' ')[1];
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Get all products
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create product
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { name, description, price, weight, origin, image_url, stock } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, weight, origin, image_url, stock) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, price, weight, origin, image_url, stock]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update product
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { name, description, price, weight, origin, image_url, stock } = req.body;
  try {
    const result = await pool.query(
      'UPDATE products SET name=$1, description=$2, price=$3, weight=$4, origin=$5, image_url=$6, stock=$7 WHERE id=$8 RETURNING *',
      [name, description, price, weight, origin, image_url, stock, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Modificar stock
router.put('/:id/stock', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  if (typeof stock !== 'number' || stock < 0) return res.status(400).json({ message: 'Stock inválido' });
  try {
    await pool.query('UPDATE products SET stock = $1 WHERE id = $2', [stock, id]);
    res.json({ message: 'Stock actualizado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar stock' });
  }
});

// Habilitar/deshabilitar producto
router.put('/:id/enable', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { enabled } = req.body;
  if (typeof enabled !== 'boolean') return res.status(400).json({ message: 'Valor enabled inválido' });
  try {
    await pool.query('UPDATE products SET enabled = $1 WHERE id = $2', [enabled, id]);
    res.json({ message: 'Estado actualizado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar estado' });
  }
});

// Admin: Delete product
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 