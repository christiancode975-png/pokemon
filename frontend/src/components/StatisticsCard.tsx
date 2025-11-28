import { PriceStatistics } from '../types';

interface StatisticsCardProps {
  stats: PriceStatistics;
}

export default function StatisticsCard({ stats }: StatisticsCardProps) {
  const priceChange = stats.current_price - stats.initial_price;
  const priceChangePercent = stats.initial_price > 0
    ? ((priceChange / stats.initial_price) * 100).toFixed(2)
    : '0.00';

  const isPositive = priceChange >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Statistiche Prezzi</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-sm text-gray-600">Prezzo Attuale</p>
          <p className="text-2xl font-bold text-pokemon-blue">
            €{stats.current_price?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <p className="text-sm text-gray-600">Prezzo Minimo</p>
          <p className="text-2xl font-bold text-green-600">
            €{stats.min_price?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded">
          <p className="text-sm text-gray-600">Prezzo Massimo</p>
          <p className="text-2xl font-bold text-red-600">
            €{stats.max_price?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded">
          <p className="text-sm text-gray-600">Prezzo Medio</p>
          <p className="text-2xl font-bold text-yellow-600">
            €{stats.avg_price?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded">
          <p className="text-sm text-gray-600">Variazione</p>
          <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}€{priceChange.toFixed(2)}
          </p>
          <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            ({isPositive ? '+' : ''}{priceChangePercent}%)
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600">Rilevazioni</p>
          <p className="text-2xl font-bold text-gray-700">
            {stats.total_entries || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
