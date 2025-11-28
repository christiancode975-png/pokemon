import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { PriceEntry } from '../types';

interface PriceChartProps {
  data: PriceEntry[];
}

export default function PriceChart({ data }: PriceChartProps) {
  const chartData = data.map(entry => ({
    date: entry.recorded_at ? format(parseISO(entry.recorded_at), 'dd/MM/yyyy', { locale: it }) : '',
    price: entry.price,
    fullDate: entry.recorded_at,
  }));

  const formatYAxis = (value: number) => `€${value.toFixed(2)}`;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{payload[0].payload.date}</p>
          <p className="text-pokemon-red font-bold text-lg">
            €{payload[0].value.toFixed(2)}
          </p>
          {payload[0].payload.source && (
            <p className="text-sm text-gray-600">Fonte: {payload[0].payload.source}</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
        Nessun dato di prezzo disponibile
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Andamento Prezzi</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={80}
            style={{ fontSize: '12px' }}
          />
          <YAxis tickFormatter={formatYAxis} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#EE1515"
            strokeWidth={2}
            dot={{ fill: '#EE1515', r: 4 }}
            activeDot={{ r: 6 }}
            name="Prezzo"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
