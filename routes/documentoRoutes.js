const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Conexión a PostgreSQL en Render (usando variable de entorno)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Obtener todos los documentos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM documento');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo documento
router.post('/', async (req, res) => {
  try {
    const { descripcion } = req.body;
    const result = await pool.query(
      'INSERT INTO documento (descripcion) VALUES ($1) RETURNING *',
      [descripcion]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar documento
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion } = req.body;
    const result = await pool.query(
      'UPDATE documento SET descripcion = $1 WHERE id = $2 RETURNING *',
      [descripcion, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar documento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM documento WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;