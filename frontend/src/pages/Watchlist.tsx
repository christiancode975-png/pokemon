import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Product } from '../types';
import PriceTrend from '../components/PriceTrend';

export default function Watchlist() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const data = await api.getWatchlist();
      setProducts(data);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Caricamento...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Watchlist Vuota</h1>
        <p className="text-gray-600 mb-4">Non hai ancora aggiunto prodotti alla watchlist</p>
        <Link to="/" className="text-pokemon-blue hover:underline">
          Esplora i prodotti
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">La Mia Watchlist ⭐</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow p-4"
          >
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            {product.latest_price !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-pokemon-red">
                  €{product.latest_price.toFixed(2)}
                </span>
                <PriceTrend trend={product.price_trend} size="lg" />
              </div>
            )}
            {product.has_alert && (
              <div className="mt-2 text-sm text-green-600 font-semibold">
                🔔 Alert attivo
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
