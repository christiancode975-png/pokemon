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
      condition TEXT DEFAULT 'Near Mint',
      language TEXT DEFAULT 'Italiano',
      edition TEXT,
      is_watched INTEGER DEFAULT 0,
      owned_quantity INTEGER DEFAULT 0,
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
      condition TEXT,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS price_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      target_price REAL NOT NULL,
      alert_type TEXT DEFAULT 'below',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS user_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      note TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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

  await run(`
    CREATE INDEX IF NOT EXISTS idx_products_is_watched
    ON products(is_watched)
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_price_alerts_product_id
    ON price_alerts(product_id)
  `);

  console.log('Database initialized successfully');
};

export { db, run, get, all };
