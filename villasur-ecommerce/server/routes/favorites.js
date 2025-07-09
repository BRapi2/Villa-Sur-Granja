import express from 'express';
import pool from '../models/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Obtener productos favoritos del usuario (datos completos)
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const favRes = await pool.query(`
      SELECT p.* FROM favorites f
      JOIN products p ON f.product_id = p.id
      WHERE f.user_id = $1
    `, [userId]);
    res.json(favRes.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener favoritos.' });
  }
});

// Agregar producto a favoritos
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.body;
  if (!product_id) return res.status(400).json({ message: 'Falta product_id.' });
  try {
    await pool.query('INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, product_id]);
    res.json({ message: 'Producto agregado a favoritos.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar a favoritos.' });
  }
});

// Eliminar producto de favoritos
router.delete('/:productId', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;
  try {
    await pool.query('DELETE FROM favorites WHERE user_id = $1 AND product_id = $2', [userId, productId]);
    res.json({ message: 'Producto eliminado de favoritos.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar de favoritos.' });
  }
});

export default router; 