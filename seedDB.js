import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

async function insertarDatos() {
  try {
    // 🧠 Especialidades
    await pool.query(`
      INSERT INTO especialidad (descripcion) VALUES
      ('Informática'),
      ('Administración'),
      ('Contaduría'),
      ('Turismo')
      ON CONFLICT DO NOTHING;
    `);

    // 📄 Documentos
    await pool.query(`
      INSERT INTO documento (descripcion) VALUES
      ('Constancia de estudios'),
      ('Carnet universitario'),
      ('Carta de buena conducta'),
      ('Solicitud de espacio')
      ON CONFLICT DO NOTHING;
    `);

    // 📌 Estatus
    await pool.query(`
      INSERT INTO estatus (descripcion) VALUES
      ('Pendiente'),
      ('Aprobado'),
      ('Rechazado')
      ON CONFLICT DO NOTHING;
    `);

    // 👥 Estudiantes
    await pool.query(`
      INSERT INTO estudiante (cedula, nombres) VALUES
      ('V12345678', 'Juan Pérez'),
      ('V87654321', 'María Gómez'),
      ('V11223344', 'Luis Rodríguez')
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Datos de prueba insertados correctamente');
  } catch (error) {
    console.error('❌ Error al insertar datos:', error);
  } finally {
    await pool.end();
  }
}

insertarDatos();
