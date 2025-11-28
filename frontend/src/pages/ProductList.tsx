import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Product } from '../types';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import PriceTrend from '../components/PriceTrend';
import CollectionDashboard from '../components/CollectionDashboard';
import { exportToCSV } from '../utils/exportCSV';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Errore nel caricamento dei prodotti');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    exportToCSV(products);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.category.toLowerCase().includes(filter.toLowerCase()) ||
    p.set_name?.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Caricamento...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <CollectionDashboard />

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Prodotti Pokemon</h1>
          <input
            type="text"
            placeholder="Cerca prodotti..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
          />
        </div>
        {products.length > 0 && (
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            📊 Esporta CSV
          </button>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">
            {filter ? 'Nessun prodotto trovato' : 'Nessun prodotto disponibile'}
          </p>
          {!filter && (
            <Link
              to="/add-product"
              className="inline-block px-6 py-3 bg-pokemon-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Aggiungi il primo prodotto
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden relative"
            >
              {product.is_watched === 1 && (
                <div className="absolute top-2 right-2 z-10 bg-yellow-400 text-yellow-900 rounded-full p-2 shadow-lg">
                  ⭐
                </div>
              )}
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-pokemon-red to-pokemon-blue flex items-center justify-center">
                  <span className="text-6xl">⚡</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-semibold">Categoria:</span> {product.category}</p>
                  {product.set_name && (
                    <p><span className="font-semibold">Set:</span> {product.set_name}</p>
                  )}
                  {product.rarity && (
                    <p><span className="font-semibold">Rarità:</span> {product.rarity}</p>
                  )}
                  {product.card_number && (
                    <p><span className="font-semibold">Numero:</span> {product.card_number}</p>
                  )}
                  {product.condition && (
                    <p><span className="font-semibold">Condizione:</span> {product.condition}</p>
                  )}
                  {product.language && (
                    <p><span className="font-semibold">Lingua:</span> {product.language}</p>
                  )}
                </div>
                {product.latest_price !== undefined && product.latest_price !== null && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Ultimo prezzo</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-pokemon-red">
                        €{product.latest_price.toFixed(2)}
                      </p>
                      <PriceTrend trend={product.price_trend} size="lg" />
                    </div>
                    {product.latest_price_date && (
                      <p className="text-xs text-gray-500">
                        {format(parseISO(product.latest_price_date), 'dd/MM/yyyy HH:mm', { locale: it })}
                      </p>
                    )}
                  </div>
                )}
                {product.has_alert && (
                  <div className="mt-2 flex items-center gap-1 text-sm text-green-600 font-semibold">
                    🔔 Alert attivo
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
