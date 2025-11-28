import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Carte',
    set_name: '',
    rarity: '',
    card_number: '',
    image_url: '',
    external_link: '',
    description: '',
    condition: 'Near Mint',
    language: 'Italiano',
    edition: '',
    owned_quantity: 0,
  });
  const [initialPrice, setInitialPrice] = useState('');
  const [priceSource, setPriceSource] = useState('');
  const [priceCondition, setPriceCondition] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const product = await api.createProduct(formData);

      if (initialPrice && product.id) {
        await api.addPrice(product.id, {
          price: parseFloat(initialPrice),
          source: priceSource || undefined,
          condition: priceCondition || undefined,
        });
      }

      navigate(`/products/${product.id}`);
    } catch (err) {
      alert('Errore nella creazione del prodotto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Aggiungi Nuovo Prodotto</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Prodotto *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
              placeholder="es. Charizard VMAX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
            >
              <option value="Carte">Carte</option>
              <option value="Booster Box">Booster Box</option>
              <option value="Elite Trainer Box">Elite Trainer Box</option>
              <option value="Collection Box">Collection Box</option>
              <option value="Tin">Tin</option>
              <option value="Blister">Blister</option>
              <option value="Bundle">Bundle</option>
              <option value="Accessori">Accessori</option>
              <option value="Altro">Altro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condizione *
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
            >
              <option value="Mint">Mint (M)</option>
              <option value="Near Mint">Near Mint (NM)</option>
              <option value="Excellent">Excellent (EX)</option>
              <option value="Good">Good (GD)</option>
              <option value="Light Played">Light Played (LP)</option>
              <option value="Played">Played (PL)</option>
              <option value="Poor">Poor (PO)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Set
            </label>
            <input
              type="text"
              name="set_name"
              value={formData.set_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
              placeholder="es. Evolving Skies"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rarità
            </label>
            <input
              type="text"
              name="rarity"
              value={formData.rarity}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
              placeholder="es. Ultra Rare, Secret Rare..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numero Carta
            </label>
            <input
              type="text"
              name="card_number"
              value={formData.card_number}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
              placeholder="es. 123/456"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lingua *
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
            >
              <option value="Italiano">Italiano</option>
              <option value="Inglese">Inglese</option>
              <option value="Giapponese">Giapponese</option>
              <option value="Francese">Francese</option>
              <option value="Tedesco">Tedesco</option>
              <option value="Spagnolo">Spagnolo</option>
              <option value="Coreano">Coreano</option>
              <option value="Cinese">Cinese</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Edizione
            </label>
            <input
              type="text"
              name="edition"
              value={formData.edition}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
              placeholder="es. 1st Edition, Unlimited..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantità Posseduta
            </label>
            <input
              type="number"
              name="owned_quantity"
              value={formData.owned_quantity}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Immagine
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link Esterno (es. CardMarket)
            </label>
            <input
              type="url"
              name="external_link"
              value={formData.external_link}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
              placeholder="https://www.cardmarket.com/..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrizione
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
              placeholder="Note aggiuntive sul prodotto..."
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prezzo Iniziale (Opzionale)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prezzo (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={initialPrice}
                onChange={(e) => setInitialPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fonte
              </label>
              <input
                type="text"
                value={priceSource}
                onChange={(e) => setPriceSource(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
                placeholder="es. CardMarket"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condizione Prezzo
              </label>
              <select
                value={priceCondition}
                onChange={(e) => setPriceCondition(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
              >
                <option value="">-- Seleziona --</option>
                <option value="Mint">Mint</option>
                <option value="Near Mint">Near Mint</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Light Played">Light Played</option>
                <option value="Played">Played</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-pokemon-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creazione...' : 'Crea Prodotto'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Annulla
          </button>
        </div>
      </form>
    </div>
  );
}
