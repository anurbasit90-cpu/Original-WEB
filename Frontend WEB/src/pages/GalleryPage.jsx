import React, { useEffect, useState } from 'react';
import { WP_API_BASE } from '../config/wp';
import { fetchWithRetry, isAbortError } from '../utils/http';
import ProductImage from '../components/ProductImage';

// Komponen PageContainer untuk styling yang konsisten
const PageContainer = ({ children }) => (
  <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16 animate-fade-in">{children}</div>
);

export default function GalleryPage({ t }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchGalleryData = async () => {
      try {
        setLoading(true);

        // --- PENTING ---
        // Pastikan 'gallery_item' di bawah ini adalah NAMA SLUG CPT Anda di WordPress.
        const data = await fetchWithRetry(`${WP_API_BASE}/gallery_item?per_page=100`, { 
          signal: controller.signal, 
          retries: 1 
        });
        
        const mappedImages = data.map((item) => {
          // Mengambil gambar dari bidang ACF 'gambar_galeri'
          // Ini sama dengan cara Anda mengambil 'gambar_produk'
          const imgField = item.acf?.gambar_galeri;
          
          // Menangani jika ACF mengembalikan URL (string) atau objek gambar
          const imageUrl = typeof imgField === 'string' ? imgField : (imgField?.url || null);
          
          return {
            id: item.id,
            title: item.title.rendered,
            imageUrl: imageUrl, // URL gambar dari ACF
          };
        }).filter(item => item.imageUrl); // Hanya tampilkan item yang memiliki gambar

        if (!controller.signal.aborted) {
          setGalleryItems(mappedImages);
          setError(null);
        }
      } catch (err) {
        if (isAbortError(err)) return; // Abaikan error jika komponen unmount
        // Error fetching gallery data: err
        setError(err.message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchGalleryData();
    return () => controller.abort();
  }, []); // Dependensi kosong agar hanya berjalan sekali

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
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-800">{t.galleryTitle || 'Galeri Proyek'}</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">{t.galleryDesc || 'Dokumentasi foto dari proyek yang telah kami kerjakan.'}</p>
      </div>

      {galleryItems.length === 0 ? (
         <div className="text-center py-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Belum Ada Foto</h3>
          <p className="text-gray-600">Silakan tambahkan foto di WordPress pada CPT "Galeri".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:shadow-xl transition-shadow duration-300"
            >
              <ProductImage 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="p-3 sm:p-4">
                <h3 
                  className="text-sm sm:text-base font-semibold text-gray-800 truncate" 
                  title={item.title}
                  dangerouslySetInnerHTML={{ __html: item.title }} // Render judul dari WP
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
