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
  created_at?: string;
}

export interface PriceEntry {
  id?: number;
  product_id: number;
  price: number;
  currency?: string;
  source?: string;
  recorded_at?: string;
}

export interface ProductWithLatestPrice extends Product {
  latest_price?: number;
  latest_price_date?: string;
}

export class ProductModel {
  static async create(product: Product): Promise<number> {
    const result = await run(
      `INSERT INTO products (name, category, set_name, rarity, card_number, image_url, external_link, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.name,
        product.category,
        product.set_name || null,
        product.rarity || null,
        product.card_number || null,
        product.image_url || null,
        product.external_link || null,
        product.description || null,
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
      ORDER BY p.created_at DESC
    `);
    return products as ProductWithLatestPrice[];
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
      `INSERT INTO price_history (product_id, price, currency, source)
       VALUES (?, ?, ?, ?)`,
      [entry.product_id, entry.price, entry.currency || 'EUR', entry.source || null]
    );
    return (result as any).lastID;
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
