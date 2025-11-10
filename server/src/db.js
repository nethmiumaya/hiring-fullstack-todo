import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = 'nethmi123',
  DB_NAME = 'todo_app',
  DB_PORT = '3306'
} = process.env;

let pool;

/**
 * Initializes the MySQL database:
 * - Creates the database if it doesn't exist
 * - Creates the todos table if it doesn't exist
 * - Initializes and stores a connection pool
 */
export async function initDb() {
  const bootstrapConn = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT
  });

  await bootstrapConn.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await bootstrapConn.end();

  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true
  });

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS todos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NULL,
      done TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  return pool;
}

export function getPool() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initDb() first.');
  }
  return pool;
}

export async function closePool() {
  if (pool) {
    try {
      await pool.end();
    } finally {
      pool = null;
    }
  }
}
