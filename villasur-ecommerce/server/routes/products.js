import express from 'express';
import pool from '../models/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

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