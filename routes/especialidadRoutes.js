const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Conexión a PostgreSQL en Render (usando variable de entorno)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Obtener todas las especialidades
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM especialidad');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nueva especialidad
router.post('/', async (req, res) => {
  try {
    const { descripcion } = req.body;
    const result = await pool.query(
      'INSERT INTO especialidad (descripcion) VALUES ($1) RETURNING *',
      [descripcion]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear especialidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar especialidad
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion } = req.body;
    const result = await pool.query(
      'UPDATE especialidad SET descripcion = $1 WHERE id = $2 RETURNING *',
      [descripcion, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar especialidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar especialidad
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM especialidad WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error al eliminar especialidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;