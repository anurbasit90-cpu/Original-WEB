import React, { useEffect, useState } from 'react';
import ProductImage from '../components/ProductImage';
import Icons from '../components/Icons';
import { WP_API_BASE } from '../config/wp';

const PageContainer = ({ children }) => (
  <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16 animate-fade-in">{children}</div>
);

export default function ProductsPage({ onProductClick, t }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsList, setProductsList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
  // const [selectedCategory, setSelectedCategory] = useState(() => localStorage.getItem('productCategory') || 'all');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('productViewMode') || 'grid');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${WP_API_BASE}/produk?_embed&per_page=100`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        const mapped = data.map((item) => {
          const imgField = item.acf?.gambar_produk;
          const img = typeof imgField === 'string' ? imgField : imgField?.url || '';
          const shortDesc = item.acf?.short_description ?? item.acf?.short_desc ?? '';
          const description = item.acf?.deskripsi_produk ?? item.acf?.full_description ?? '';
          const fitur = item.acf?.fitur_utama ?? item.acf?.key_features ?? '';
          return {
            id: item.id,
            name: item.title.rendered,
            img,
            shortDesc,
            details: {
              description,
              keyFeatures: fitur ? fitur.split('\n').filter((f) => f.trim()) : [],
            },
          };
        });
        setProductsList(mapped);
        setError(null);
      } catch (err) {
        // Error fetching products: err
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // const categories = [];

  // Persist selected category (dihapus karena kategori di-nonaktifkan)
  // Debounce search to reduce re-renders
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm.trim().toLowerCase()), 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const filteredProducts = productsList.filter((product) => {
    const q = debouncedSearch;
    if (q) {
      const hay = `${product.name} ${product.shortDesc || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('productViewMode', mode);
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          <span className="ml-4 text-lg text-gray-700">{t.loading || 'Memuat...'}</span>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16">
          <span className="text-red-600 text-xl font-bold mb-2">{t.error || 'Terjadi kesalahan'}</span>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-blue-500 text-white px-4 py-2 rounded">
            {t.tryAgain || 'Coba Lagi'}
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-800">{t.productsTitle}</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">{t.productsDesc}</p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{Icons.search}</div>
          <input
            type="text"
            placeholder={t.searchProducts || 'Cari produk...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-800"
              aria-label="Hapus pencarian"
              title="Hapus pencarian"
            >
              {Icons.x}
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Kategori dihapus sesuai permintaan */}

          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === 'grid' ? 'bg-white text-[#003366] shadow' : 'text-gray-600 hover:text-gray-800'
              }`}
              title={t.gridView || 'Tampilan Grid'}
            >
              <span className="sr-only">{t.gridView || 'Tampilan Grid'}</span>
              {Icons.grid}
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === 'list' ? 'bg-white text-[#003366] shadow' : 'text-gray-600 hover:text-gray-800'
              }`}
              title={t.listView || 'Tampilan List'}
            >
              <span className="sr-only">{t.listView || 'Tampilan List'}</span>
              {Icons.list}
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          {t.showingResults || 'Menampilkan'} <span className="font-semibold">{filteredProducts.length}</span> {t.of || 'dari'}{' '}
          <span className="font-semibold">{productsList.length}</span> {t.productsFound || 'produk'}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{t.noProductsFound || 'Produk tidak ditemukan'}</h3>
          <p className="text-gray-600">{t.tryDifferentKeywords || 'Coba kata kunci yang berbeda'}</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-transform duration-300">
              <ProductImage src={product.img} alt={`Gambar produk ${product.name}`} className="w-full h-36 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">{product.name}</h3>
                <p className="text-gray-600 flex-grow text-xs sm:text-base">{product.shortDesc}</p>
                <button onClick={() => onProductClick(product)} className="mt-3 sm:mt-4 bg-[#003366] text-white font-bold py-2 px-4 rounded-lg w-full hover:bg-blue-800 transition-colors duration-300 text-xs sm:text-base">
                  {t.viewDetails || 'Lihat Detail'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row group hover:shadow-lg transition-shadow duration-300">
              <ProductImage src={product.img} alt={`Gambar produk ${product.name}`} className="w-full md:w-64 h-36 sm:h-48 object-cover" />
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h3 className="text-base sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2 sm:mb-4 flex-grow text-xs sm:text-base">{product.shortDesc}</p>
                <div className="flex items-center justify-between">
                  <button onClick={() => onProductClick(product)} className="bg-[#003366] text-white font-bold py-2 px-4 sm:px-6 rounded-lg hover:bg-blue-800 transition-colors duration-300 inline-flex items-center gap-2 text-xs sm:text-base">
                    {t.viewDetails || 'Lihat Detail'} {Icons.arrowRight}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
