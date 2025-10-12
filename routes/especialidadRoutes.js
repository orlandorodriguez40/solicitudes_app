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

// Obtener todas las especialidades
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM especialidad');
  res.json(result.rows);
});

// Crear nueva especialidad
router.post('/', async (req, res) => {
  const { descripcion } = req.body;
  const result = await pool.query(
    'INSERT INTO especialidad (descripcion) VALUES ($1) RETURNING *',
    [descripcion]
  );
  res.json(result.rows[0]);
});

// Actualizar especialidad
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { descripcion } = req.body;
  const result = await pool.query(
    'UPDATE especialidad SET descripcion = $1 WHERE id = $2 RETURNING *',
    [descripcion, id]
  );
  res.json(result.rows[0]);
});

// Eliminar especialidad
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM especialidad WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = router;