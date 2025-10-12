const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Conexión a PostgreSQL en Render (usando variable de entorno)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Obtener todos los estudiantes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM estudiante');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo estudiante
router.post('/', async (req, res) => {
  try {
    const { cedula, nombres } = req.body;
    const result = await pool.query(
      'INSERT INTO estudiante (cedula, nombres) VALUES ($1, $2) RETURNING *',
      [cedula, nombres]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar estudiante
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cedula, nombres } = req.body;
    const result = await pool.query(
      'UPDATE estudiante SET cedula = $1, nombres = $2 WHERE id = $3 RETURNING *',
      [cedula, nombres, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar estudiante
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM estudiante WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;