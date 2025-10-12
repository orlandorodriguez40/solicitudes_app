require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL (Render o cualquier servicio en la nube)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('✅ API de Solicitudes funcionando en Render');
});

// Rutas principales
const estudianteRoutes = require('./routes/estudianteRoutes');
app.use('/estudiantes', estudianteRoutes);

const especialidadRoutes = require('./routes/especialidadRoutes');
app.use('/especialidades', especialidadRoutes);

const documentoRoutes = require('./routes/documentoRoutes');
app.use('/documentos', documentoRoutes);

const estatusRoutes = require('./routes/estatusRoutes');
app.use('/estatus', estatusRoutes);

const solicitudRoutes = require('./routes/solicitudRoutes');
app.use('/solicitudes', solicitudRoutes);

// Iniciar servidor con puerto dinámico
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

require('./setupDB');