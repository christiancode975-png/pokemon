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
  latest_price?: number;
  latest_price_date?: string;
}

export interface PriceEntry {
  id?: number;
  product_id: number;
  price: number;
  currency?: string;
  source?: string;
  recorded_at?: string;
}

export interface PriceStatistics {
  min_price: number;
  max_price: number;
  avg_price: number;
  total_entries: number;
  current_price: number;
  initial_price: number;
}
