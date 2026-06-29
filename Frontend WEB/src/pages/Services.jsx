import React, { useEffect, useState } from 'react';
import Icons from '../components/Icons';
import { Wrench } from 'lucide-react';
import { WP_API_BASE } from '../config/wp';
import { fetchWithRetry, isAbortError } from '../utils/http';

export default function Services({ t }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await fetchWithRetry(`${WP_API_BASE}/layanan?_embed&per_page=100`, { signal: controller.signal, retries: 1 });
        const mapped = data.map((item) => {
          const iconName = (item.acf?.nama_ikon ?? item.acf?.icon_name ?? 'wrench').toLowerCase();
          const detailsText = item.acf?.detail_poin_layanan ?? item.acf?.service_points ?? '';
          const details = detailsText
            ? detailsText.split('\n').filter((d) => d.trim())
            : [];

          // Gunakan icon sebagai React element, fallback ke Wrench jika tidak ada
          const mappedIcon = Icons[iconName];
          // IconComponent: komponen React, bukan function yang return element
          const IconComponent = mappedIcon
            ? (props) => React.cloneElement(mappedIcon, props)
            : Wrench;

          return {
            id: item.id,
            title: item.title.rendered,
            icon: IconComponent,
            details,
          };
        });
        if (!controller.signal.aborted) {
          setServices(mapped);
          setError(null);
        }
      } catch (err) {
        if (isAbortError(err)) return; // ignore expected aborts (StrictMode/unmount)
        // Error fetching services: err
        setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchServices();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <section id="services" className="py-10 sm:py-20 bg-gray-100">
        <div className="container mx-auto px-2 sm:px-6">
          <div className="flex items-center justify-center py-10 sm:py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            <span className="ml-4 text-base sm:text-lg text-gray-700">{t.loading || 'Memuat...'}</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="py-10 sm:py-20 bg-gray-100">
        <div className="container mx-auto px-2 sm:px-6">
          <div className="text-center py-10 sm:py-16">
            <p className="text-red-600 font-bold">{t.error || 'Gagal memuat layanan'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-10 sm:py-20 bg-gray-100">
      <div className="container mx-auto px-2 sm:px-6">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-800">{t.servicesTitle}</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">{t.servicesDesc}</p>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white p-4 sm:p-8 rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-center justify-center h-14 w-14 sm:h-20 sm:w-20 bg-blue-100 text-blue-500 rounded-full mb-4 sm:mb-6 mx-auto">
                  {/* Icon scalable, center, responsive */}
                  <IconComponent size={36} className="w-7 h-7 sm:w-12 sm:h-12" />
                </div>
                <h3 className="text-base sm:text-2xl font-bold text-center mb-2 sm:mb-4">{service.title}</h3>
                <ul className="space-y-1 sm:space-y-2 text-gray-600 text-xs sm:text-sm">
                  {service.details.map((detail, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
