import { run, get, all } from '../database';

export interface Product {
  id?: number;
  name: string;
  category: string;
  set_name?: string;
  rarity?: string;
  card_number?: string;
  image_url?: string;
  external_link?: string;
  description?: string;
  condition?: string;
  language?: string;
  edition?: string;
  is_watched?: number;
  owned_quantity?: number;
  created_at?: string;
}

export interface PriceEntry {
  id?: number;
  product_id: number;
  price: number;
  currency?: string;
  source?: string;
  condition?: string;
  recorded_at?: string;
}

export interface PriceAlert {
  id?: number;
  product_id: number;
  target_price: number;
  alert_type?: string;
  is_active?: number;
  created_at?: string;
}

export interface UserNote {
  id?: number;
  product_id: number;
  note: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductWithLatestPrice extends Product {
  latest_price?: number;
  latest_price_date?: string;
  price_trend?: 'up' | 'down' | 'stable';
  has_alert?: boolean;
  user_note?: string;
}

export class ProductModel {
  static async create(product: Product): Promise<number> {
    const result = await run(
      `INSERT INTO products (name, category, set_name, rarity, card_number, image_url, external_link, description, condition, language, edition, owned_quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.name,
        product.category,
        product.set_name || null,
        product.rarity || null,
        product.card_number || null,
        product.image_url || null,
        product.external_link || null,
        product.description || null,
        product.condition || 'Near Mint',
        product.language || 'Italiano',
        product.edition || null,
        product.owned_quantity || 0,
      ]
    );
    return (result as any).lastID;
  }

  static async findById(id: number): Promise<Product | null> {
    const product = await get('SELECT * FROM products WHERE id = ?', [id]);
    return product as Product | null;
  }

  static async findAll(): Promise<ProductWithLatestPrice[]> {
    const products = await all(`
      SELECT
        p.*,
        ph.price as latest_price,
        ph.recorded_at as latest_price_date,
        ph_prev.price as previous_price,
        CASE
          WHEN pa.id IS NOT NULL THEN 1
          ELSE 0
        END as has_alert,
        un.note as user_note
      FROM products p
      LEFT JOIN (
        SELECT product_id, price, recorded_at
        FROM price_history
        WHERE (product_id, recorded_at) IN (
          SELECT product_id, MAX(recorded_at)
          FROM price_history
          GROUP BY product_id
        )
      ) ph ON p.id = ph.product_id
      LEFT JOIN (
        SELECT ph1.product_id, ph1.price
        FROM price_history ph1
        WHERE ph1.recorded_at = (
          SELECT MAX(ph2.recorded_at)
          FROM price_history ph2
          WHERE ph2.product_id = ph1.product_id
          AND ph2.recorded_at < (
            SELECT MAX(recorded_at)
            FROM price_history
            WHERE product_id = ph1.product_id
          )
        )
      ) ph_prev ON p.id = ph_prev.product_id
      LEFT JOIN price_alerts pa ON p.id = pa.product_id AND pa.is_active = 1
      LEFT JOIN user_notes un ON p.id = un.product_id
      ORDER BY p.created_at DESC
    `);

    return (products as any[]).map((p: any) => {
      let price_trend: 'up' | 'down' | 'stable' = 'stable';
      if (p.latest_price && p.previous_price) {
        if (p.latest_price > p.previous_price) price_trend = 'up';
        else if (p.latest_price < p.previous_price) price_trend = 'down';
      }
      return {
        ...p,
        price_trend,
        has_alert: Boolean(p.has_alert),
      };
    });
  }

  static async update(id: number, product: Partial<Product>): Promise<void> {
    const fields = Object.keys(product)
      .filter(key => key !== 'id' && key !== 'created_at')
      .map(key => `${key} = ?`)
      .join(', ');

    const values = Object.keys(product)
      .filter(key => key !== 'id' && key !== 'created_at')
      .map(key => (product as any)[key]);

    values.push(id);

    await run(`UPDATE products SET ${fields} WHERE id = ?`, values);
  }

  static async delete(id: number): Promise<void> {
    await run('DELETE FROM products WHERE id = ?', [id]);
  }

  static async addPriceEntry(entry: PriceEntry): Promise<number> {
    const result = await run(
      `INSERT INTO price_history (product_id, price, currency, source, condition)
       VALUES (?, ?, ?, ?, ?)`,
      [entry.product_id, entry.price, entry.currency || 'EUR', entry.source || null, entry.condition || null]
    );
    return (result as any).lastID;
  }

  static async toggleWatchlist(productId: number): Promise<void> {
    await run(
      `UPDATE products SET is_watched = CASE WHEN is_watched = 1 THEN 0 ELSE 1 END WHERE id = ?`,
      [productId]
    );
  }

  static async getWatchlist(): Promise<ProductWithLatestPrice[]> {
    const products = await all(`
      SELECT
        p.*,
        ph.price as latest_price,
        ph.recorded_at as latest_price_date
      FROM products p
      LEFT JOIN (
        SELECT product_id, price, recorded_at
        FROM price_history
        WHERE (product_id, recorded_at) IN (
          SELECT product_id, MAX(recorded_at)
          FROM price_history
          GROUP BY product_id
        )
      ) ph ON p.id = ph.product_id
      WHERE p.is_watched = 1
      ORDER BY p.name ASC
    `);
    return products as ProductWithLatestPrice[];
  }

  static async addPriceAlert(alert: PriceAlert): Promise<number> {
    const result = await run(
      `INSERT INTO price_alerts (product_id, target_price, alert_type)
       VALUES (?, ?, ?)`,
      [alert.product_id, alert.target_price, alert.alert_type || 'below']
    );
    return (result as any).lastID;
  }

  static async getPriceAlerts(productId: number): Promise<PriceAlert[]> {
    const alerts = await all(
      `SELECT * FROM price_alerts WHERE product_id = ? AND is_active = 1`,
      [productId]
    );
    return alerts as PriceAlert[];
  }

  static async deletePriceAlert(alertId: number): Promise<void> {
    await run('DELETE FROM price_alerts WHERE id = ?', [alertId]);
  }

  static async addNote(productId: number, note: string): Promise<number> {
    const existing = await get('SELECT id FROM user_notes WHERE product_id = ?', [productId]);

    if (existing) {
      await run(
        `UPDATE user_notes SET note = ?, updated_at = CURRENT_TIMESTAMP WHERE product_id = ?`,
        [note, productId]
      );
      return (existing as any).id;
    } else {
      const result = await run(
        `INSERT INTO user_notes (product_id, note) VALUES (?, ?)`,
        [productId, note]
      );
      return (result as any).lastID;
    }
  }

  static async getNote(productId: number): Promise<UserNote | null> {
    const note = await get('SELECT * FROM user_notes WHERE product_id = ?', [productId]);
    return note as UserNote | null;
  }

  static async deleteNote(productId: number): Promise<void> {
    await run('DELETE FROM user_notes WHERE product_id = ?', [productId]);
  }

  static async getCollectionValue(): Promise<{ total_value: number; total_items: number }> {
    const result = await get(`
      SELECT
        COALESCE(SUM(ph.price * p.owned_quantity), 0) as total_value,
        COALESCE(SUM(p.owned_quantity), 0) as total_items
      FROM products p
      LEFT JOIN (
        SELECT product_id, price
        FROM price_history
        WHERE (product_id, recorded_at) IN (
          SELECT product_id, MAX(recorded_at)
          FROM price_history
          GROUP BY product_id
        )
      ) ph ON p.id = ph.product_id
      WHERE p.owned_quantity > 0
    `);
    return result as { total_value: number; total_items: number };
  }

  static async getPriceHistory(
    productId: number,
    startDate?: string,
    endDate?: string
  ): Promise<PriceEntry[]> {
    let query = 'SELECT * FROM price_history WHERE product_id = ?';
    const params: any[] = [productId];

    if (startDate) {
      query += ' AND recorded_at >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND recorded_at <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY recorded_at ASC';

    const history = await all(query, params);
    return history as PriceEntry[];
  }

  static async getPriceStatistics(productId: number) {
    const stats = await get(
      `SELECT
        MIN(price) as min_price,
        MAX(price) as max_price,
        AVG(price) as avg_price,
        COUNT(*) as total_entries,
        (SELECT price FROM price_history WHERE product_id = ? ORDER BY recorded_at DESC LIMIT 1) as current_price,
        (SELECT price FROM price_history WHERE product_id = ? ORDER BY recorded_at ASC LIMIT 1) as initial_price
       FROM price_history
       WHERE product_id = ?`,
      [productId, productId, productId]
    );
    return stats;
  }
}
