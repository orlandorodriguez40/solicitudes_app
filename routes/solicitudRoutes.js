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

// Obtener todas las solicitudes con JOIN
router.get('/', async (req, res) => {
  const result = await pool.query(`
    SELECT s.id, s.fecha, s.observacion,
           e.nombres AS estudiante,
           d.descripcion AS documento,
           es.descripcion AS especialidad,
           st.descripcion AS estatus
    FROM solicitud s
    JOIN estudiante e ON s.estudiante_id = e.id
    JOIN documento d ON s.documento_id = d.id
    JOIN especialidad es ON s.especialidad_id = es.id
    JOIN estatus st ON s.estatus_id = st.id
  `);
  res.json(result.rows);
});

// Crear nueva solicitud
router.post('/', async (req, res) => {
  const { fecha, observacion, estudiante_id, documento_id, especialidad_id, estatus_id } = req.body;
  const result = await pool.query(
    `INSERT INTO solicitud (fecha, observacion, estudiante_id, documento_id, especialidad_id, estatus_id)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [fecha, observacion, estudiante_id, documento_id, especialidad_id, estatus_id]
  );
  res.json(result.rows[0]);
});

// Actualizar solicitud
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { fecha, observacion, estudiante_id, documento_id, especialidad_id, estatus_id } = req.body;
  const result = await pool.query(
    `UPDATE solicitud SET fecha = $1, observacion = $2, estudiante_id = $3,
     documento_id = $4, especialidad_id = $5, estatus_id = $6 WHERE id = $7 RETURNING *`,
    [fecha, observacion, estudiante_id, documento_id, especialidad_id, estatus_id, id]
  );
  res.json(result.rows[0]);
});

// Eliminar solicitud
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM solicitud WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = router;