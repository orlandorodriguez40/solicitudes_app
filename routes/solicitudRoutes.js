const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Conexión a PostgreSQL en Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// 📋 Obtener todas las solicitudes con JOIN
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
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
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener solicitudes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🆕 Crear nueva solicitud
router.post('/', async (req, res) => {
  const { observacion, estudiante_id, documento_id, especialidad_id, estatus_id } = req.body;

  if (!estudiante_id || !documento_id || !especialidad_id || !estatus_id) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios excepto observación' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO solicitud (observacion, estudiante_id, documento_id, especialidad_id, estatus_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [observacion || '', estudiante_id, documento_id, especialidad_id, estatus_id]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('❌ Error al crear solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ✏️ Actualizar solicitud
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { observacion, estudiante_id, documento_id, especialidad_id, estatus_id } = req.body;

  if (!estudiante_id || !documento_id || !especialidad_id || !estatus_id) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios excepto observación' });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE solicitud SET observacion = $1, estudiante_id = $2,
       documento_id = $3, especialidad_id = $4, estatus_id = $5 WHERE id = $6 RETURNING *`,
      [observacion || '', estudiante_id, documento_id, especialidad_id, estatus_id, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error al actualizar solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🗑️ Eliminar solicitud
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM solicitud WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error('❌ Error al eliminar solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
