const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'solicitudes_app',
  password: 'OARGjorg1234/*-+',
  port: 5433, // Asegúrate de usar el puerto correcto
});

// Obtener todos los estatus
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM estatus');
  res.json(result.rows);
});

// Crear nuevo estatus
router.post('/', async (req, res) => {
  const { descripcion } = req.body;
  const result = await pool.query(
    'INSERT INTO estatus (descripcion) VALUES ($1) RETURNING *',
    [descripcion]
  );
  res.json(result.rows[0]);
});

// Actualizar estatus
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { descripcion } = req.body;
  const result = await pool.query(
    'UPDATE estatus SET descripcion = $1 WHERE id = $2 RETURNING *',
    [descripcion, id]
  );
  res.json(result.rows[0]);
});

// Eliminar estatus
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM estatus WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = router;