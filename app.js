require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// 🛡️ Middlewares
app.use(cors());
app.use(express.json());

// 🗃️ Conexión a PostgreSQL (Render o cualquier servicio en la nube)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// 🔍 Ruta de prueba
app.get('/', (req, res) => {
  res.send('✅ API de Solicitudes funcionando en Render');
});

// 📦 Rutas principales
app.use('/estudiantes', require('./routes/estudianteRoutes'));
app.use('/especialidades', require('./routes/especialidadRoutes'));
app.use('/documentos', require('./routes/documentoRoutes'));
app.use('/estatus', require('./routes/estatusRoutes'));
app.use('/solicitudes', require('./routes/solicitudRoutes'));

// 🚀 Iniciar servidor con puerto dinámico
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

// 🧱 Inicialización de tablas (solo una vez al inicio)
require('./setupDB');
