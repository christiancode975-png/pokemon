import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-pokemon-red text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold flex items-center gap-2">
                <span className="text-pokemon-yellow">⚡</span>
                Pokemon Price Tracker
              </Link>
            </div>
            <div className="flex gap-4">
              <Link
                to="/"
                className="px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Prodotti
              </Link>
              <Link
                to="/add-product"
                className="px-4 py-2 bg-pokemon-yellow text-pokemon-red rounded font-semibold hover:bg-yellow-400 transition-colors"
              >
                + Aggiungi Prodotto
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-400">
            Pokemon Price Tracker - Monitora i prezzi dei tuoi prodotti Pokemon preferiti
          </p>
        </div>
      </footer>
    </div>
  );
}
