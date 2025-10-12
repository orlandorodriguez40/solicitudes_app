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

// Obtener todos los documentos
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM documento');
  res.json(result.rows);
});

// Crear nuevo documento
router.post('/', async (req, res) => {
  const { descripcion } = req.body;
  const result = await pool.query(
    'INSERT INTO documento (descripcion) VALUES ($1) RETURNING *',
    [descripcion]
  );
  res.json(result.rows[0]);
});

// Actualizar documento
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { descripcion } = req.body;
  const result = await pool.query(
    'UPDATE documento SET descripcion = $1 WHERE id = $2 RETURNING *',
    [descripcion, id]
  );
  res.json(result.rows[0]);
});

// Eliminar documento
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM documento WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = router;