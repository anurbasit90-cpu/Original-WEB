import React, { useEffect, useState } from 'react';
import { WP_API_BASE } from '../config/wp';
import { fetchWithRetry, isAbortError } from '../utils/http';

const PageContainer = ({ children }) => (
  <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16 animate-fade-in">{children}</div>
);

export default function PortfolioPage({ t }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const data = await fetchWithRetry(`${WP_API_BASE}/portofolio?_embed&per_page=100`, { signal: controller.signal, retries: 1 });
        const mapped = data.map((item) => ({
          id: item.id,
          customer: item.title.rendered,
          year: item.acf?.tahun || '',
          project: item.acf?.jenis_pekerjaan || '',
        }));
        if (!controller.signal.aborted) {
          setProjects(mapped);
          setError(null);
        }
      } catch (err) {
        if (isAbortError(err)) return; // ignore expected aborts (StrictMode/unmount)
        // Error fetching portfolio: err
        setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchPortfolio();
    return () => controller.abort();
  }, []);

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
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-800">{t.portfolioTitle}</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">{t.portfolioDesc}</p>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">{t.year || 'Tahun'}</th>
              <th scope="col" className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">{t.client || 'Klien'}</th>
              <th scope="col" className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">{t.projectType || 'Jenis Proyek'}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-2 sm:px-6 py-3 whitespace-nowrap font-medium text-gray-900">{project.year}</td>
                <td className="px-2 sm:px-6 py-3 whitespace-nowrap text-gray-500">{project.customer}</td>
                <td className="px-2 sm:px-6 py-3 whitespace-nowrap text-gray-500">{project.project}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
