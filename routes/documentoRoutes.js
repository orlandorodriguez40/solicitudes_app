// routes/documentoRoutes.js
import express from 'express';
import { Pool } from 'pg';

const router = express.Router();

// 🔹 Conexión a PostgreSQL en Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// 📄 Obtener todos los documentos
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM documento');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener documentos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🆕 Crear nuevo documento
router.post('/', async (req, res) => {
  const { descripcion } = req.body;
  if (!descripcion) {
    return res.status(400).json({ error: 'La descripción es obligatoria' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO documento (descripcion) VALUES ($1) RETURNING *',
      [descripcion]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('❌ Error al crear documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ✏️ Actualizar documento
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { descripcion } = req.body;
  if (!descripcion) {
    return res.status(400).json({ error: 'La descripción es obligatoria' });
  }

  try {
    const { rows } = await pool.query(
      'UPDATE documento SET descripcion = $1 WHERE id = $2 RETURNING *',
      [descripcion, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error al actualizar documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🗑️ Eliminar documento
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM documento WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error('❌ Error al eliminar documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
