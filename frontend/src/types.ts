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
  latest_price?: number;
  latest_price_date?: string;
  price_trend?: 'up' | 'down' | 'stable';
  has_alert?: boolean;
  user_note?: string;
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

export interface PriceStatistics {
  min_price: number;
  max_price: number;
  avg_price: number;
  total_entries: number;
  current_price: number;
  initial_price: number;
}

export interface PriceAlert {
  id?: number;
  product_id: number;
  target_price: number;
  alert_type?: 'below' | 'above';
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

export interface CollectionValue {
  total_value: number;
  total_items: number;
}
