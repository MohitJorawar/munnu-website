import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

async function setup() {
  // Connection config for the default database
  // For Supabase, DB_NAME is already 'postgres', so we connect directly
  const dbName = process.env.DB_NAME || 'handi_chic';
  const isSupabase = (process.env.DB_HOST || '').includes('supabase');
  const sslConfig = process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false };

  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    database: isSupabase ? dbName : 'postgres', // Supabase: connect directly; Local: connect to default db first
    ssl: sslConfig,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL...');

    // 1. Create the database if it doesn't exist (skip for Supabase — database is pre-created)
    if (isSupabase) {
      console.log(`Using Supabase database "${dbName}" (skipping CREATE DATABASE)...`);
    } else {
      const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
      
      if (res.rowCount === 0) {
        console.log(`Creating database "${dbName}"...`);
        await client.query(`CREATE DATABASE ${dbName}`);
      } else {
        console.log(`Database "${dbName}" already exists.`);
      }
    }

    // 2. Connect to the target database to create tables
    // For Supabase we can reuse the same connection since we're already connected to the right DB
    let dbClient;
    if (isSupabase) {
      dbClient = client; // Already connected to the right database
    } else {
      await client.end();
      dbClient = new Client({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
        database: dbName,
        ssl: sslConfig,
      });
      await dbClient.connect();
    }

    // Create products table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        image TEXT,
        in_stock BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Products table created or already exists.');

    // Seed products if empty
    const productCountResult = await dbClient.query('SELECT COUNT(*) FROM products');
    if (parseInt(productCountResult.rows[0].count) === 0) {
      console.log('Seeding default products...');
      const defaultProducts = [
        ["Rose Quartz Pendant", 1250, "Handcrafted rose quartz pendant on a delicate gold chain. Each stone is uniquely shaped by nature.", "Jewellery", "", true],
        ["Scrunchie Set", 299, "Set of 5 premium satin scrunchies in assorted colours. Gentle on hair, stylish all day.", "Hair Accessories", "", true],
        ["Birthday Gift Hamper", 1499, "Curated birthday hamper with handmade goodies, candle, and personalised card.", "Gift Hampers", "", true],
        ["Aesthetic Wall Poster (A3)", 199, "High-quality A3 aesthetic poster for bedroom or study room décor.", "Posters & Wall Decor", "", true],
        ["Personalised Name Keychain", 349, "Custom keychain with your name or initials, handcrafted and delivered in a gift box.", "Customized Gifts", "", true],
        ["Jewellery + Poster Combo", 999, "A gorgeous combo of one pendant and one A3 poster at a special bundled price.", "Combos & Offers", "", true],
        ["Pearl Drop Earrings", 890, "Freshwater pearl drop earrings with gold-filled hooks. Elegant and timeless.", "Jewellery", "", true],
        ["Claw Clip Pack", 399, "Set of 3 sturdy claw clips in trending colours — perfect for thick and thin hair.", "Hair Accessories", "", true]
      ];

      for (const p of defaultProducts) {
        await dbClient.query(
          'INSERT INTO products (name, price, description, category, image, in_stock) VALUES ($1, $2, $3, $4, $5, $6)',
          p
        );
      }
      console.log('Seeded default products.');
    }

    // Create categories table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Categories table created or already exists.');

    // Seed categories if empty
    const categoryCountResult = await dbClient.query('SELECT COUNT(*) FROM categories');
    if (parseInt(categoryCountResult.rows[0].count) === 0) {
      console.log('Seeding default categories...');
      const defaultCategories = [
        "Jewellery",
        "Hair Accessories",
        "Gift Hampers",
        "Posters & Wall Decor",
        "Customized Gifts",
        "Combos & Offers",
        "New Arrivals",
        "Best Sellers"
      ];

      for (const cat of defaultCategories) {
        await dbClient.query(
          'INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
          [cat]
        );
      }
      console.log('Seeded default categories.');
    }
    
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    console.log('Running schema.sql...');
    await dbClient.query(schema);
    
    console.log('✅ Setup complete! You can now run "npm start".');
    await dbClient.end();

  } catch (err) {
    console.error('❌ Setup failed:', err.message);
    process.exit(1);
  }
}

setup();
