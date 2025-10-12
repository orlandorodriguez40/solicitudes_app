require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const crearTablas = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS estudiante (
        id SERIAL PRIMARY KEY,
        cedula VARCHAR(20) NOT NULL,
        nombres VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS especialidad (
        id SERIAL PRIMARY KEY,
        descripcion VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS documento (
        id SERIAL PRIMARY KEY,
        descripcion VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS estatus (
        id SERIAL PRIMARY KEY,
        descripcion VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS solicitud (
        id SERIAL PRIMARY KEY,
        estudiante_id INTEGER REFERENCES estudiante(id) ON DELETE CASCADE,
        especialidad_id INTEGER REFERENCES especialidad(id) ON DELETE CASCADE,
        documento_id INTEGER REFERENCES documento(id) ON DELETE CASCADE,
        estatus_id INTEGER REFERENCES estatus(id) ON DELETE CASCADE,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        observacion TEXT
      );
    `);

    console.log('✅ Tablas creadas correctamente');
  } catch (error) {
    console.error('❌ Error al crear tablas:', error);
  } finally {
    await pool.end();
  }
};

crearTablas();
