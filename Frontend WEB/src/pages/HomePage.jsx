import React, { useEffect, useState } from 'react';
import Services from '../components/Services';
import ProductImage from '../components/ProductImage';
import Icons from '../components/Icons';
import { WP_API_BASE } from '../config/wp';
import { fetchWithRetry, isAbortError } from '../utils/http';

const PageContainer = ({ children }) => (
  <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16 animate-fade-in">{children}</div>
);

export default function HomePage({ setCurrentPage, onProductClick, t }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [heroImageUrl, setHeroImageUrl] = useState(''); // <-- TAMBAHKAN BARIS INI
  // Partners disabled until CPT is created in WordPress
  // const [partners, setPartners] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch produk dan gambar hero bersamaan
        const [prodResponse, heroResponse] = await Promise.all([
          fetchWithRetry(`${WP_API_BASE}/produk?_embed&per_page=100`, { signal: controller.signal, retries: 1 }),
          fetchWithRetry(`${WP_API_BASE}/gambar_about`, { signal: controller.signal, retries: 1 })
        ]);

        // Proses data produk
        const mappedProducts = prodResponse.map((item) => {
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

        // Proses gambar hero (ambil dari postingan pertama 'gambar_about')
        if (heroResponse && heroResponse.length > 0) {
          setHeroImageUrl(heroResponse[0].acf.gambar_hero_homepage);
        }

        if (!controller.signal.aborted) {
          setFeaturedProducts(mappedProducts.slice(0, 4));
          setError(null);
        }
      } catch (err) {
        if (isAbortError(err)) return; // ignore expected aborts (StrictMode/unmount)
        // Error fetching homepage data: err
        setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        <span className="ml-4 text-lg text-gray-700">{t.loading || 'Memuat...'}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="text-red-600 text-xl font-bold mb-2">{t.error || 'Terjadi kesalahan'}</span>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-500 text-white px-4 py-2 rounded">
          {t.tryAgain || 'Coba Lagi'}
        </button>
      </div>
    );
  }

  return (
    <>
      <section
        className="min-h-[60vh] sm:min-h-screen flex items-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.8), rgba(0, 51, 102, 0.8))${heroImageUrl ? ", url('" + heroImageUrl + "')" : ''}`,
        }}
      >
        <div className="container mx-auto px-2 sm:px-4 text-center">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold leading-tight mb-3 sm:mb-4 text-white">{t.homeTitle}</h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto text-gray-200">{t.homeDesc}</p>
          <button
            onClick={() => setCurrentPage('products')}
            className="bg-white text-[#003366] font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full hover:bg-gray-200 transition-transform duration-300 transform hover:scale-105 inline-block text-sm sm:text-base"
          >
            {t.exploreProducts}
          </button>
        </div>
      </section>

      <Services t={t} />

      <section className="bg-gray-50 py-10 sm:py-20">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-800">{t.featuredProducts}</h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">{t.featuredProductsDesc}</p>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-transform duration-300"
              >
                <ProductImage src={product.img} alt={`Gambar produk ${product.name}`} className="w-full h-36 sm:h-48 object-cover" />
                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">{product.name}</h3>
                  <p className="text-gray-600 flex-grow mb-2 sm:mb-4 text-xs sm:text-base">{product.shortDesc}</p>
                  <button onClick={() => onProductClick(product)} className="text-xs sm:text-sm text-[#003366] font-semibold hover:underline self-start">
                    {t.viewDetails || 'Lihat Detail'} {Icons.arrowRight}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-12">
            <button
              onClick={() => setCurrentPage('products')}
              className="bg-[#003366] text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full hover:bg-blue-800 transition-transform duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              {t.viewAllProducts}
            </button>
          </div>
        </div>
      </section>

      {/* Partners section - disabled until CPT is created in WordPress
      {partners.length > 0 && (
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800">{t.partnersTitle}</h2>
              <p className="text-gray-600 mt-2">{t.partnersDesc}</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
              {partners.map((p) => (
                <img
                  key={p.id}
                  src={p.logo}
                  alt={`Logo partner ${p.name}`}
                  title={p.name}
                  className="h-12 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </section>
      )}
      */}
    </>
  );
}
