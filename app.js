import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

// 🔹 Cargar variables de entorno
dotenv.config();

// 🔹 Inicializar Express
const app = express();
const port = process.env.PORT || 3000;

// 🔹 Middleware global
app.use(cors());
app.use(express.json());

// 🔹 Conexión a PostgreSQL en Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// 🔹 Importar rutas
import estudianteRoutes from './routes/estudianteRoutes.js';
import especialidadRoutes from './routes/especialidadRoutes.js';
import documentoRoutes from './routes/documentoRoutes.js';
import estatusRoutes from './routes/estatusRoutes.js';
import solicitudRoutes from './routes/solicitudRoutes.js';
import estadisticasRoutes from './routes/estadisticasRoutes.js';
import opcionesRoutes from './routes/opcionesRoutes.js'; // ✅ Dropdown dinámico

// 🔹 Registrar rutas
app.use('/api/estudiante', estudianteRoutes);
app.use('/api/especialidad', especialidadRoutes);
app.use('/api/documento', documentoRoutes);
app.use('/api/estatus', estatusRoutes);
app.use('/api/solicitud', solicitudRoutes);
app.use('/api/estadistica', estadisticasRoutes);
app.use('/api/opciones', opcionesRoutes);

// 🔹 Endpoint de prueba
app.get('/', (req, res) => {
  res.send('API de Solicitudes funcionando 🚀');
});

// 🔹 Iniciar servidor
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en puerto ${port}`);
});
