/**
 * Database Setup Script
 * Run this ONCE before starting the server to create the database.
 * Usage: node setup-db.js
 */
require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  console.log(`\n🔧 Setting up database: ${DB_NAME}\n`);

  let connection;
  try {
    // Connect without specifying a database
    connection = await mysql.createConnection({
      host: DB_HOST || 'localhost',
      port: parseInt(DB_PORT) || 3306,
      user: DB_USER || 'root',
      password: DB_PASSWORD || '',
    });

    // Create database if not exists
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ Database "${DB_NAME}" created (or already exists)`);

    await connection.end();
    console.log('\n✅ Database setup complete!');
    console.log('👉 Now run: node seeders/seed.js');
    console.log('👉 Then run: npm run dev\n');
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   → Check your DB_USER and DB_PASSWORD in .env');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   → Make sure MySQL server is running');
    }
    process.exit(1);
  }
}

setupDatabase();
