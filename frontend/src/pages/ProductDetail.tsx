import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Product, PriceEntry, PriceStatistics } from '../types';
import PriceChart from '../components/PriceChart';
import StatisticsCard from '../components/StatisticsCard';
import { format, parseISO, subYears } from 'date-fns';
import { it } from 'date-fns/locale';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceEntry[]>([]);
  const [statistics, setStatistics] = useState<PriceStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [source, setSource] = useState('');
  const [timeRange, setTimeRange] = useState<'all' | '1y' | '5y' | '10y' | '20y'>('all');

  useEffect(() => {
    if (id) {
      loadProductData();
    }
  }, [id, timeRange]);

  const loadProductData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const productId = parseInt(id);

      const [productData, statsData] = await Promise.all([
        api.getProduct(productId),
        api.getPriceStatistics(productId),
      ]);

      setProduct(productData);
      setStatistics(statsData);

      let startDate: string | undefined;
      const now = new Date();

      switch (timeRange) {
        case '1y':
          startDate = subYears(now, 1).toISOString();
          break;
        case '5y':
          startDate = subYears(now, 5).toISOString();
          break;
        case '10y':
          startDate = subYears(now, 10).toISOString();
          break;
        case '20y':
          startDate = subYears(now, 20).toISOString();
          break;
      }

      const historyData = await api.getPriceHistory(productId, startDate);
      setPriceHistory(historyData);

      setError(null);
    } catch (err) {
      setError('Errore nel caricamento del prodotto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newPrice) return;

    try {
      await api.addPrice(parseInt(id), {
        price: parseFloat(newPrice),
        source: source || undefined,
      });
      setNewPrice('');
      setSource('');
      loadProductData();
    } catch (err) {
      alert('Errore nell\'aggiunta del prezzo');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Sei sicuro di voler eliminare questo prodotto?')) return;

    try {
      await api.deleteProduct(parseInt(id));
      navigate('/');
    } catch (err) {
      alert('Errore nell\'eliminazione del prodotto');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Caricamento...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error || 'Prodotto non trovato'}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="text-pokemon-blue hover:underline">
          ← Torna alla lista
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full rounded-lg mb-4"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-pokemon-red to-pokemon-blue flex items-center justify-center rounded-lg mb-4">
              <span className="text-8xl">⚡</span>
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <div className="space-y-2 text-sm">
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
            {product.description && (
              <p className="mt-4 text-gray-700">{product.description}</p>
            )}
            {product.external_link && (
              <a
                href={product.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-4 py-2 bg-pokemon-blue text-white rounded hover:bg-blue-700 transition-colors"
              >
                Vedi su CardMarket ↗
              </a>
            )}
          </div>
          <button
            onClick={handleDelete}
            className="mt-6 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Elimina Prodotto
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {statistics && <StatisticsCard stats={statistics} />}

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Aggiungi Nuovo Prezzo</h3>
            <form onSubmit={handleAddPrice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prezzo (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fonte (opzionale)
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="es. CardMarket, eBay, negozio locale..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-pokemon-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Aggiungi Prezzo
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setTimeRange('all')}
            className={`px-4 py-2 rounded ${
              timeRange === 'all'
                ? 'bg-pokemon-red text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Tutto
          </button>
          <button
            onClick={() => setTimeRange('1y')}
            className={`px-4 py-2 rounded ${
              timeRange === '1y'
                ? 'bg-pokemon-red text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            1 Anno
          </button>
          <button
            onClick={() => setTimeRange('5y')}
            className={`px-4 py-2 rounded ${
              timeRange === '5y'
                ? 'bg-pokemon-red text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            5 Anni
          </button>
          <button
            onClick={() => setTimeRange('10y')}
            className={`px-4 py-2 rounded ${
              timeRange === '10y'
                ? 'bg-pokemon-red text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            10 Anni
          </button>
          <button
            onClick={() => setTimeRange('20y')}
            className={`px-4 py-2 rounded ${
              timeRange === '20y'
                ? 'bg-pokemon-red text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            20 Anni
          </button>
        </div>
      </div>

      <PriceChart data={priceHistory} />

      {priceHistory.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
          <h3 className="text-xl font-semibold p-6 bg-gray-50 border-b border-gray-200">
            Storico Prezzi
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prezzo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fonte
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...priceHistory].reverse().map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.recorded_at
                        ? format(parseISO(entry.recorded_at), 'dd/MM/yyyy HH:mm', { locale: it })
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-pokemon-red">
                      €{entry.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {entry.source || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
