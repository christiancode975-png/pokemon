import { Product } from '../types';

export const exportToCSV = (products: Product[]) => {
  const headers = [
    'ID',
    'Nome',
    'Categoria',
    'Set',
    'Rarità',
    'Numero',
    'Condizione',
    'Lingua',
    'Edizione',
    'Quantità',
    'Prezzo Attuale',
    'Trend',
    'Link Esterno',
  ];

  const rows = products.map(p => [
    p.id,
    p.name,
    p.category,
    p.set_name || '',
    p.rarity || '',
    p.card_number || '',
    p.condition || '',
    p.language || '',
    p.edition || '',
    p.owned_quantity || 0,
    p.latest_price?.toFixed(2) || '',
    p.price_trend || '',
    p.external_link || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `pokemon-collection-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
