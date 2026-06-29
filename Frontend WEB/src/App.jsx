import React, { Suspense, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BackToTopButton from './components/BackToTopButton';
import SEO from './components/SEO';
import ErrorBoundary from './components/ErrorBoundary';
// Lazy-load pages for faster initial load
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const PortfolioPage = React.lazy(() => import('./pages/PortfolioPage'));
const GalleryPage = React.lazy(() => import('./pages/GalleryPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
import ProductImage from './components/ProductImage';
import Icons from './components/Icons';
import { useLang } from './hooks/useLang';
import { companyData } from './constants/companyData';

const ProductDetailModal = ({ product, onClose, t }) => {
  const handleOrderClick = () => {
    const message = `Halo ${companyData.name}, saya tertarik dengan produk ${product.name} dan ingin meminta informasi lebih lanjut/penawaran.`;
    const whatsappUrl = `https://wa.me/${companyData.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in-fast">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-2xl font-bold text-gray-800">{product.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{Icons.x}</button>
        </div>
        <div className="p-6 overflow-y-auto">
          <ProductImage src={product.img} alt={product.name} className="w-full h-64 object-cover rounded-md mb-6" />
          <h4 className="text-xl font-bold text-[#003366] mb-2">{t.productDescription || 'Deskripsi Produk'}</h4>
          <div 
            className="text-gray-700 mb-6 prose prose-sm max-w-none" 
            dangerouslySetInnerHTML={{ __html: product.details.description }}
          />
          {product.details.keyFeatures && product.details.keyFeatures.length > 0 && (
            <>
              <h4 className="text-xl font-bold text-[#003366] mb-2">{t.keyFeatures || 'Fitur Utama'}</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {product.details.keyFeatures.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="p-4 bg-gray-50 border-t">
          <button onClick={handleOrderClick} className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300">
            {t.requestQuote || 'Minta Penawaran'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { lang, setLang, t } = useLang();

  const seoData = {
    home: {
      title: lang === 'id' ? 'Beranda' : 'Home',
      description:
        lang === 'id'
          ? 'PT. Aryatek Kontrol Sejahtera - Solusi Panel Listrik & Kontrol Industri Terpercaya sejak 2018. Spesialis pembuatan panel LVMDP, LVSDP, MCC, VSD, dan sistem otomasi industri.'
          : 'PT. Aryatek Kontrol Sejahtera - Trusted Electrical Panel & Industrial Control Solutions since 2018. Specialist in LVMDP, LVSDP, MCC, VSD panels and industrial automation systems.',
      keywords:
        'panel listrik, panel maker, electrical panel, LVMDP, LVSDP, MCC, VSD, VFD, panel industri, electrical contractor, cikarang, bekasi, panel control, automation',
    },
    about: {
      title: lang === 'id' ? 'Profil Perusahaan' : 'Company Profile',
      description:
        lang === 'id'
          ? 'Profil PT. Aryatek Kontrol Sejahtera - Perusahaan panel maker dan electrical contractor terpercaya di Cikarang sejak 2018. Visi dan misi perusahaan.'
          : 'Profile of PT. Aryatek Kontrol Sejahtera - Trusted panel maker and electrical contractor in Cikarang since 2018. Company vision and mission.',
      keywords: 'profil perusahaan, about us, company profile, panel maker cikarang, electrical contractor bekasi, aryatek, visi misi',
    },
    products: {
      title: lang === 'id' ? 'Katalog Produk' : 'Product Catalog',
      description:
        lang === 'id'
          ? 'Katalog lengkap produk panel listrik: LVMDP, LVSDP, Capacitor Bank, AMF-ATS, MCC, VSD/VFD, Panel Otomasi, PLC, dan 20+ jenis panel lainnya untuk kebutuhan industri Anda.'
          : 'Complete electrical panel catalog: LVMDP, LVSDP, Capacitor Bank, AMF-ATS, MCC, VSD/VFD, Automation Panels, PLC, and 20+ other panel types for your industrial needs.',
      keywords:
        'katalog produk, panel LVMDP, panel LVSDP, capacitor bank, panel MCC, VSD, VFD, panel otomasi, PLC panel, AMF ATS, soft starter, DOL panel, harga panel listrik',
    },
    portfolio: {
      title: lang === 'id' ? 'Portofolio Proyek' : 'Project Portfolio',
      description:
        lang === 'id'
          ? 'Portofolio proyek PT. Aryatek Kontrol Sejahtera - Daftar lengkap klien dan proyek panel listrik yang telah dikerjakan untuk berbagai industri di Indonesia.'
          : 'Portfolio of PT. Aryatek Kontrol Sejahtera - Complete list of clients and electrical panel projects completed for various industries in Indonesia.',
      keywords:
        'portfolio, project, klien, client list, proyek panel listrik, referensi proyek, electrical project, industrial client',
    },
    gallery: {
      title: lang === 'id' ? 'Galeri Proyek' : 'Project Gallery',
      description:
        lang === 'id'
          ? 'Lihat galeri foto proyek-proyek yang telah diselesaikan oleh PT. Aryatek Kontrol Sejahtera. Dokumentasi panel listrik dan instalasi.'
          : 'View the project photo gallery completed by PT. Aryatek Kontrol Sejahtera. Documentation of electrical panels and installations.',
      keywords:
        'galeri proyek, dokumentasi foto, foto panel listrik, instalasi industri, project gallery, aryatek photos',
    },
    contact: {
      title: lang === 'id' ? 'Hubungi Kami' : 'Contact Us',
      description:
        lang === 'id'
          ? 'Hubungi PT. Aryatek Kontrol Sejahtera untuk konsultasi panel listrik dan sistem kontrol industri. Alamat: Cikarang Selatan, Bekasi. Telp: 021-22104903, WhatsApp: 0813-1144-0029'
          : 'Contact PT. Aryatek Kontrol Sejahtera for electrical panel and industrial control system consultation. Address: Cikarang Selatan, Bekasi. Phone: 021-22104903, WhatsApp: 0813-1144-0029',
      keywords:
        'contact, hubungi kami, alamat, telepon, whatsapp, email, lokasi, cikarang, bekasi, konsultasi panel listrik',
    },
  };

  // Helper to get SEO data based on current route
  function useCurrentSEO() {
    const location = useLocation();
    if (location.pathname === '/about') return seoData.about;
    if (location.pathname === '/products') return seoData.products;
    if (location.pathname === '/portfolio') return seoData.portfolio;
    if (location.pathname === '/gallery') return seoData.gallery;
    if (location.pathname === '/contact') return seoData.contact;
    return seoData.home;
  }

  function AppContent() {
    const currentSEO = useCurrentSEO();
    const location = useLocation();
    const navigate = useNavigate();

    return (
      <div className="font-sans bg-white">
        <SEO
          title={currentSEO.title}
          description={currentSEO.description}
          keywords={currentSEO.keywords}
          lang={lang}
          canonical={currentSEO.canonical || 'https://aryatek.co.id'}
          robots={currentSEO.robots || 'index, follow'}
        />
        <Header
          currentPage={location.pathname.replace('/', '') || 'home'}
          setCurrentPage={(page) => navigate(page === 'home' ? '/' : `/${page}`)}
          t={t}
          lang={lang}
          setLang={setLang}
        />
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                <span className="ml-4 text-lg text-gray-700">{t.loading || 'Memuat...'}</span>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage setCurrentPage={(page) => navigate(page === 'home' ? '/' : `/${page}`)} onProductClick={setSelectedProduct} t={t} />} />
              <Route path="/about" element={<AboutPage t={t} />} />
              <Route path="/products" element={<ProductsPage onProductClick={setSelectedProduct} t={t} />} />
              <Route path="/portfolio" element={<PortfolioPage t={t} />} />
              <Route path="/gallery" element={<GalleryPage t={t} />} />
              <Route path="/contact" element={<ContactPage t={t} />} />
              <Route path="*" element={<HomePage setCurrentPage={(page) => navigate(page === 'home' ? '/' : `/${page}`)} onProductClick={setSelectedProduct} t={t} />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <Footer t={t} />
        <BackToTopButton t={t} />
        {selectedProduct && (
          <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} t={t} />
        )}
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}