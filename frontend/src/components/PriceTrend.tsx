interface PriceTrendProps {
  trend?: 'up' | 'down' | 'stable';
  size?: 'sm' | 'md' | 'lg';
}

export default function PriceTrend({ trend = 'stable', size = 'md' }: PriceTrendProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  if (trend === 'up') {
    return <span className={`${sizeClasses[size]} text-green-600 font-bold`} title="Prezzo in aumento">↑</span>;
  }

  if (trend === 'down') {
    return <span className={`${sizeClasses[size]} text-red-600 font-bold`} title="Prezzo in diminuzione">↓</span>;
  }

  return <span className={`${sizeClasses[size]} text-gray-400`} title="Prezzo stabile">—</span>;
}
