const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Conexión a PostgreSQL en Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// 📌 Obtener todos los estatus
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM estatus');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener estatus:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🆕 Crear nuevo estatus
router.post('/', async (req, res) => {
  const { descripcion } = req.body;
  if (!descripcion) {
    return res.status(400).json({ error: 'La descripción es obligatoria' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO estatus (descripcion) VALUES ($1) RETURNING *',
      [descripcion]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('❌ Error al crear estatus:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ✏️ Actualizar estatus
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { descripcion } = req.body;
  if (!descripcion) {
    return res.status(400).json({ error: 'La descripción es obligatoria' });
  }

  try {
    const { rows } = await pool.query(
      'UPDATE estatus SET descripcion = $1 WHERE id = $2 RETURNING *',
      [descripcion, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Estatus no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error al actualizar estatus:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🗑️ Eliminar estatus
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM estatus WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Estatus no encontrado' });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error('❌ Error al eliminar estatus:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
