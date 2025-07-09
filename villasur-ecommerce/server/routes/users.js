import express from 'express';
import pool from '../models/db.js';
import jwt from 'jsonwebtoken';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Middleware para verificar admin
// (Eliminada la función requireAdmin aquí, ya que se importa desde middleware/auth.js)

// Listar usuarios
router.get('/', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, role, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Eliminar usuario
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

export default router; 