import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Product, PriceEntry, PriceStatistics, PriceAlert } from '../types';
import PriceChart from '../components/PriceChart';
import StatisticsCard from '../components/StatisticsCard';
import PriceTrend from '../components/PriceTrend';
import { format, parseISO, subYears } from 'date-fns';
import { it } from 'date-fns/locale';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceEntry[]>([]);
  const [statistics, setStatistics] = useState<PriceStatistics | null>(null);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [userNote, setUserNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [source, setSource] = useState('');
  const [newAlert, setNewAlert] = useState({ target_price: '', alert_type: 'below' as 'below' | 'above' });
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

      const [productData, statsData, alertsData, noteData] = await Promise.all([
        api.getProduct(productId),
        api.getPriceStatistics(productId),
        api.getPriceAlerts(productId),
        api.getNote(productId),
      ]);

      setProduct(productData);
      setStatistics(statsData);
      setAlerts(alertsData);
      setUserNote(noteData?.note || '');

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

  const handleToggleWatchlist = async () => {
    if (!id) return;
    try {
      await api.toggleWatchlist(parseInt(id));
      loadProductData();
    } catch (err) {
      alert('Errore nell\'aggiornamento della watchlist');
      console.error(err);
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

  const handleAddAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newAlert.target_price) return;

    try {
      await api.addPriceAlert(parseInt(id), {
        target_price: parseFloat(newAlert.target_price),
        alert_type: newAlert.alert_type,
      });
      setNewAlert({ target_price: '', alert_type: 'below' });
      loadProductData();
    } catch (err) {
      alert('Errore nella creazione dell\'alert');
      console.error(err);
    }
  };

  const handleDeleteAlert = async (alertId: number) => {
    try {
      await api.deletePriceAlert(alertId);
      loadProductData();
    } catch (err) {
      alert('Errore nell\'eliminazione dell\'alert');
      console.error(err);
    }
  };

  const handleSaveNote = async () => {
    if (!id) return;
    try {
      await api.addNote(parseInt(id), userNote);
      alert('Nota salvata!');
    } catch (err) {
      alert('Errore nel salvataggio della nota');
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
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="text-pokemon-blue hover:underline">
          ← Torna alla lista
        </Link>
        <button
          onClick={handleToggleWatchlist}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            product.is_watched
              ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {product.is_watched ? '⭐ In Watchlist' : '☆ Aggiungi a Watchlist'}
        </button>
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
            {product.condition && (
              <p><span className="font-semibold">Condizione:</span> {product.condition}</p>
            )}
            {product.language && (
              <p><span className="font-semibold">Lingua:</span> {product.language}</p>
            )}
            {product.edition && (
              <p><span className="font-semibold">Edizione:</span> {product.edition}</p>
            )}
            {product.owned_quantity !== undefined && product.owned_quantity > 0 && (
              <p><span className="font-semibold">Possedute:</span> {product.owned_quantity}</p>
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
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold mb-2">Note Personali</h3>
            <textarea
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
              placeholder="Aggiungi note personali..."
            />
            <button
              onClick={handleSaveNote}
              className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Salva Nota
            </button>
          </div>
          <button
            onClick={handleDelete}
            className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Elimina Prodotto
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {statistics && <StatisticsCard stats={statistics} />}

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Aggiungi Nuovo Prezzo</h3>
            <form onSubmit={handleAddPrice} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    placeholder="es. CardMarket, eBay..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-pokemon-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Aggiungi Prezzo
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Price Alerts 🔔</h3>
            <form onSubmit={handleAddAlert} className="space-y-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prezzo Target (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newAlert.target_price}
                    onChange={(e) => setNewAlert({ ...newAlert, target_price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo Alert
                  </label>
                  <select
                    value={newAlert.alert_type}
                    onChange={(e) => setNewAlert({ ...newAlert, alert_type: e.target.value as 'below' | 'above' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
                  >
                    <option value="below">Sotto</option>
                    <option value="above">Sopra</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Crea Alert
              </button>
            </form>
            {alerts.length > 0 && (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <span className="text-sm">
                      Alert quando prezzo {alert.alert_type === 'below' ? '< ' : '> '}
                      <strong>€{alert.target_price?.toFixed(2)}</strong>
                    </span>
                    <button
                      onClick={() => alert.id && handleDeleteAlert(alert.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Elimina
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condizione
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {entry.condition || '-'}
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
