import express from 'express';
import { Pool } from 'pg';

const router = express.Router();

// 🔹 Conexión a PostgreSQL en Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// 📋 Obtener todas las solicitudes con JOIN completo
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        s.id,
        e.cedula,
        e.nombres,
        esp.descripcion AS especialidad,
        d.descripcion AS documento,
        est.descripcion AS estatus,
        s.fecha_solicitud,
        s.observacion
      FROM solicitud s
      JOIN estudiante e ON s.estudiante_id = e.id
      JOIN especialidad esp ON s.especialidad_id = esp.id
      JOIN documento d ON s.documento_id = d.id
      JOIN estatus est ON s.estatus_id = est.id
      ORDER BY s.id DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('❌ Error al listar solicitudes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔍 Obtener una solicitud por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM solicitud WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('❌ Error al obtener solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🆕 Crear una solicitud
router.post('/', async (req, res) => {
  const {
    estudiante_id,
    documento_id,
    especialidad_id,
    estatus_id,
    fecha_solicitud,
    observacion,
  } = req.body;

  if (!estudiante_id || !documento_id || !especialidad_id || !estatus_id || !fecha_solicitud) {
    return res.status(400).json({ error: 'Todos los campos obligatorios deben estar presentes' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO solicitud (estudiante_id, documento_id, especialidad_id, estatus_id, fecha_solicitud, observacion)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [estudiante_id, documento_id, especialidad_id, estatus_id, fecha_solicitud, observacion]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('❌ Error al crear solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ✏️ Actualizar una solicitud
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    estudiante_id,
    documento_id,
    especialidad_id,
    estatus_id,
    fecha_solicitud,
    observacion,
  } = req.body;

  if (!estudiante_id || !documento_id || !especialidad_id || !estatus_id || !fecha_solicitud) {
    return res.status(400).json({ error: 'Todos los campos obligatorios deben estar presentes' });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE solicitud SET estudiante_id = $1, documento_id = $2,
       especialidad_id = $3, estatus_id = $4, fecha_solicitud = $5, observacion = $6
       WHERE id = $7 RETURNING *`,
      [estudiante_id, documento_id, especialidad_id, estatus_id, fecha_solicitud, observacion, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('❌ Error al actualizar solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🗑️ Eliminar una solicitud
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

export default router;

