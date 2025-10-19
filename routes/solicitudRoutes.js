import express from 'express';
import { Pool } from 'pg';

const router = express.Router();

// 🔹 Conexión a PostgreSQL en Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// 📊 Obtener estadísticas generales (calculadas en tiempo real)
router.get('/resumen', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*) AS total_solicitudes,
        COUNT(DISTINCT estudiante_id) AS total_estudiantes,
        COUNT(DISTINCT documento_id) AS total_documentos,
        COUNT(DISTINCT especialidad_id) AS total_especialidades
      FROM solicitud
    `);
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 📋 Obtener todas las estadísticas guardadas
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM estadistica ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al listar estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔍 Obtener una estadística por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM estadistica WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Estadística no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error al obtener estadística:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🆕 Crear una estadística manual
router.post('/', async (req, res) => {
  const { titulo, descripcion, total_solicitudes, total_estudiantes } = req.body;

  if (!titulo || !descripcion) {
    return res.status(400).json({ error: 'Título y descripción son obligatorios' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO estadistica (titulo, descripcion, total_solicitudes, total_estudiantes)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [titulo, descripcion, total_solicitudes || 0, total_estudiantes || 0]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('❌ Error al crear estadística:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ✏️ Actualizar una estadística
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, total_solicitudes, total_estudiantes } = req.body;

  if (!titulo || !descripcion) {
    return res.status(400).json({ error: 'Título y descripción son obligatorios' });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE estadistica SET titulo = $1, descripcion = $2,
       total_solicitudes = $3, total_estudiantes = $4 WHERE id = $5 RETURNING *`,
      [titulo, descripcion, total_solicitudes || 0, total_estudiantes || 0, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Estadística no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error al actualizar estadística:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🗑️ Eliminar una estadística
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM estadistica WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Estadística no encontrada' });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error('❌ Error al eliminar estadística:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
