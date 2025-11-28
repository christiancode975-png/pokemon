import { useEffect, useState } from 'react';
import { api } from '../api';
import { CollectionValue } from '../types';

export default function CollectionDashboard() {
  const [value, setValue] = useState<CollectionValue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollectionValue();
  }, []);

  const loadCollectionValue = async () => {
    try {
      const data = await api.getCollectionValue();
      setValue(data);
    } catch (error) {
      console.error('Error loading collection value:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (!value || value.total_items === 0) return null;

  return (
    <div className="bg-gradient-to-r from-pokemon-red to-pokemon-blue text-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Valore Collezione</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-pokemon-yellow text-sm font-semibold">Valore Totale</p>
          <p className="text-4xl font-bold">€{value.total_value.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-pokemon-yellow text-sm font-semibold">Carte Possedute</p>
          <p className="text-4xl font-bold">{value.total_items}</p>
        </div>
      </div>
    </div>
  );
}
