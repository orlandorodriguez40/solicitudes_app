const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Conexión a PostgreSQL en Render (usando variable de entorno)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Obtener todas las solicitudes con JOIN
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.fecha_solicitud, s.observacion,
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
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nueva solicitud (fecha_solicitud se genera automáticamente)
router.post('/', async (req, res) => {
  try {
    const { observacion, estudiante_id, documento_id, especialidad_id, estatus_id } = req.body;
    const result = await pool.query(
      `INSERT INTO solicitud (observacion, estudiante_id, documento_id, especialidad_id, estatus_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [observacion, estudiante_id, documento_id, especialidad_id, estatus_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar solicitud
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { observacion, estudiante_id, documento_id, especialidad_id, estatus_id } = req.body;
    const result = await pool.query(
      `UPDATE solicitud SET observacion = $1, estudiante_id = $2,
       documento_id = $3, especialidad_id = $4, estatus_id = $5 WHERE id = $6 RETURNING *`,
      [observacion, estudiante_id, documento_id, especialidad_id, estatus_id, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar solicitud
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM solicitud WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error al eliminar solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;