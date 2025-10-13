require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

async function insertarDatos() {
  try {
    // Insertar especialidades
    await pool.query(`
      INSERT INTO especialidad (descripcion) VALUES
      ('Informática'),
      ('Administración'),
      ('Contaduría'),
      ('Turismo');
    `);

    // Insertar documentos
    await pool.query(`
      INSERT INTO documento (descripcion) VALUES
      ('Constancia de estudios'),
      ('Carnet universitario'),
      ('Carta de buena conducta'),
      ('Solicitud de espacio');
    `);

    // Insertar estatus
    await pool.query(`
      INSERT INTO estatus (descripcion) VALUES
      ('Pendiente'),
      ('Aprobado'),
      ('Rechazado');
    `);

    // Insertar estudiantes
    await pool.query(`
      INSERT INTO estudiante (cedula, nombres) VALUES
      ('V12345678', 'Juan Pérez'),
      ('V87654321', 'María Gómez'),
      ('V11223344', 'Luis Rodríguez');
    `);

    console.log('✅ Datos de prueba insertados correctamente');
    pool.end();
  } catch (error) {
    console.error('❌ Error al insertar datos:', error);
    pool.end();
  }
}

insertarDatos();