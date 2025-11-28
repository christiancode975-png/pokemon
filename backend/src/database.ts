import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const db = new sqlite3.Database(process.env.DATABASE_PATH || './database.sqlite');

const run = promisify(db.run.bind(db));
const get = promisify(db.get.bind(db));
const all = promisify(db.all.bind(db));

export const initDatabase = async () => {
  await run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      set_name TEXT,
      rarity TEXT,
      card_number TEXT,
      image_url TEXT,
      external_link TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS price_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      price REAL NOT NULL,
      currency TEXT DEFAULT 'EUR',
      source TEXT,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_price_history_product_id
    ON price_history(product_id)
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at
    ON price_history(recorded_at)
  `);

  console.log('Database initialized successfully');
};

export { db, run, get, all };
