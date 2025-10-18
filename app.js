// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// 🔹 Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 🔹 Middleware
app.use(cors());
app.use(express.json());

// 🔹 Conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // necesario para Render
  },
});

// 🔹 Endpoint de prueba
app.get('/', (req, res) => {
  res.send('API de Solicitudes funcionando 🚀');
});

// 🔹 Endpoint de estadísticas
app.get('/api/estadistica', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT tipo, valor FROM estadistica');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error en /api/estadistica:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// 🔹 Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});

