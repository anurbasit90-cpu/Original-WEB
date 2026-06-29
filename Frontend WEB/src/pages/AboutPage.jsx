import React, { useState, useEffect } from 'react';
import { WP_API_BASE } from '../config/wp';
import { fetchWithRetry, isAbortError } from '../utils/http';

const PageContainer = ({ children }) => (
  <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16 animate-fade-in">{children}</div>
);

export default function AboutPage({ t }) {
  const [aboutData, setAboutData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchAboutData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWithRetry(`${WP_API_BASE}/gambar_about`, {
          signal: controller.signal,
          retries: 1
                });
                if (data && data.length > 0 && data[0].acf) {
                  if (!controller.signal.aborted) {
                    setAboutData(data[0].acf);
                  }
                } else {
                  if (!controller.signal.aborted) {
                    setAboutData({});
                  }
                }
              } catch (err) {
                if (!isAbortError(err)) {
                  console.error('Error fetching About Page data:', err);
                }
              } finally {
                if (!controller.signal.aborted) {
                  setIsLoading(false);
                }
              }
            };
            fetchAboutData();
            return () => controller.abort();
          }, []);

          // Skeleton loader
          const loadingText = <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>;
          const loadingParagraph = (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>
          );

          return (
            <PageContainer>
              <div className="text-center mb-10 sm:mb-16">
                <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">{t.aboutTitle}</h2>
                <div className="w-16 sm:w-24 h-1 bg-[#003366] mx-auto mb-4 sm:mb-6"></div>
                <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  {t.aboutSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center mb-10 sm:-16">
                <div className="order-2 lg:order-1">
                  <h3 className="text-xl sm:text-3xl font-bold text-[#003366] mb-4 sm:mb-6">
                    {t.aboutCompany || 'Tentang Perusahaan Kami'}
                  </h3>
                  <div className="space-y-4 text-gray-700 leading-relaxed prose max-w-none">
                    {isLoading ? (
                      loadingParagraph
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: aboutData.company_description || t.aboutDesc }} />
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 sm:mt-8">
                    <div className="text-center p-2 sm:p-4 bg-blue-50 rounded-lg">
                      <div className="text-lg sm:text-3xl font-bold text-[#003366] mb-0.5 sm:mb-1">7+</div>
                      <div className="text-xs sm:text-sm text-gray-600">{t.yearsExperience || 'Tahun Pengalaman'}</div>
                    </div>
                    <div className="text-center p-2 sm:p-4 bg-blue-50 rounded-lg">
                      <div className="text-lg sm:text-3xl font-bold text-[#003366] mb-0.5 sm:mb-1">25+</div>
                      <div className="text-xs sm:text-sm text-gray-600">{t.productTypes || 'Jenis Produk'}</div>
                    </div>
                    <div className="text-center p-2 sm:p-4 bg-blue-50 rounded-lg">
                      <div className="text-lg sm:text-3xl font-bold text-[#003366] mb-0.5 sm:mb-1">100+</div>
                      <div className="text-xs sm:text-sm text-gray-600">{t.projectsDone || 'Proyek Selesai'}</div>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <img
                    src={isLoading ? 'https://placehold.co/600x400' : (aboutData.gambar_halaman_about || 'https://placehold.co/600x400/E0E7FF/003366?text=Image+Not+Available')}
                    alt="Foto Tim PT. Aryatek Kontrol Sejahtera di workshop"
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                    width="600"
                    height="400"
                    className="rounded-2xl shadow-2xl w-full object-cover max-h-[420px] hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="mb-10 sm:mb-16">
                <h3 className="text-xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-12">{t.visionMission}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-white p-4 sm:p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center mb-4 sm:mb-6">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#003366] rounded-full flex items-center justify-center mr-3 sm:mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      </div>
                      <h4 className="text-lg sm:text-2xl font-bold text-[#003366]">{t.vision || 'Visi'}</h4>
                    </div>
                    {/* --- PERBAIKAN: <p> diganti <div> agar valid untuk skeleton loader --- */}
                    <div className="text-gray-700 leading-relaxed text-sm sm:text-base">
                      {isLoading ? loadingText : (aboutData.vision || t.visionText)}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-white p-4 sm:p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center mb-4 sm:mb-6">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#003366] rounded-full flex items-center justify-center mr-3 sm:mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                      </div>
                      <h4 className="text-lg sm:text-2xl font-bold text-[#003366]">{t.mission || 'Misi'}</h4>
                    </div>
                    {/* --- PERBAIKAN: <p> diganti <div> agar valid untuk skeleton loader --- */}
                    <div className="text-gray-700 leading-relaxed text-sm sm:text-base">
                      {isLoading ? loadingText : (aboutData.mission || t.missionText)}
                    </div>
                  </div>
                </div>
              </div>
            </PageContainer>
          );
        }
