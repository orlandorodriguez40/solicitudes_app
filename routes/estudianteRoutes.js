const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'solicitudes_app',
  password: 'OARGjorg1234/*-+',
  port: 5433,
});

// Obtener todos los estudiantes
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM estudiante');
  res.json(result.rows);
});

// Crear nuevo estudiante
router.post('/', async (req, res) => {
  const { cedula, nombres } = req.body;
  const result = await pool.query(
    'INSERT INTO estudiante (cedula, nombres) VALUES ($1, $2) RETURNING *',
    [cedula, nombres]
  );
  res.json(result.rows[0]);
});

// Actualizar estudiante
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { cedula, nombres } = req.body;
  const result = await pool.query(
    'UPDATE estudiante SET cedula = $1, nombres = $2 WHERE id = $3 RETURNING *',
    [cedula, nombres, id]
  );
  res.json(result.rows[0]);
});

// Eliminar estudiante
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM estudiante WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = router;