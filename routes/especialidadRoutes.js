const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Conexión a PostgreSQL en Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// 📘 Obtener todas las especialidades
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM especialidad');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener especialidades:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🆕 Crear nueva especialidad
router.post('/', async (req, res) => {
  const { descripcion } = req.body;
  if (!descripcion) {
    return res.status(400).json({ error: 'La descripción es obligatoria' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO especialidad (descripcion) VALUES ($1) RETURNING *',
      [descripcion]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('❌ Error al crear especialidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ✏️ Actualizar especialidad
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { descripcion } = req.body;
  if (!descripcion) {
    return res.status(400).json({ error: 'La descripción es obligatoria' });
  }

  try {
    const { rows } = await pool.query(
      'UPDATE especialidad SET descripcion = $1 WHERE id = $2 RETURNING *',
      [descripcion, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Especialidad no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error al actualizar especialidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🗑️ Eliminar especialidad
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM especialidad WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Especialidad no encontrada' });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error('❌ Error al eliminar especialidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
