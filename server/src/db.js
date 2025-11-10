import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;

/**
 * Initializes the MySQL database:
 * - Creates the database if it doesn't exist
 * - Creates the todos table if it doesn't exist
 * - Initializes and stores a connection pool
 */
export async function initDb() {
  const bootstrapConn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'INCLUDE_YOUR_USERNAME_HERE',
    password: process.env.DB_PASSWORD || 'INCLUDE_YOUR_PASSWORD_HERE',
    port: Number(process.env.DB_PORT) || 3306
  });

  await bootstrapConn.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'todo_app'}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await bootstrapConn.end();

  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'INCLUDE_YOUR_USERNAME_HERE',
    password: process.env.DB_PASSWORD || 'INCLUDE_YOUR_PASSWORD_HERE',
    database: process.env.DB_NAME || 'todo_app',
    port: Number(process.env.DB_PORT) || 3306,
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
