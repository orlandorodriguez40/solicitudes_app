import express from 'express';
import { Pool } from 'pg';

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// 📄 Obtener lista de documentos
router.get('/documentos', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, descripcion FROM documento ORDER BY descripcion'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('❌ Error al listar documentos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🧪 Obtener lista de especialidades
router.get('/especialidades', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, descripcion FROM especialidad ORDER BY descripcion'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('❌ Error al listar especialidades:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 📌 Obtener lista de estatus
router.get('/estatus', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, descripcion FROM estatus ORDER BY descripcion'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('❌ Error al listar estatus:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
