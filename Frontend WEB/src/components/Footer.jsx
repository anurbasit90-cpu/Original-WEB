import React from 'react';
import Icons from './Icons';
import { companyData } from '../constants/companyData';

export default function Footer({ t }) {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-blue-400">{t.legal}</h3>
            <div className="space-y-2 text-xs">
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 mb-1">Akte {t.notary}</p>
                <p className="text-gray-300 font-semibold">AHU.007971.AH.01.01 Tahun 2018</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 mb-1">{t.notary}</p>
                <p className="text-gray-300 font-semibold">Ibu. Titik Hermaiti, S.H., M.Kn</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 mb-1">{t.npwp}</p>
                <p className="text-gray-300 font-semibold">0840 3032 2641 3000</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 mb-1">{t.siup}</p>
                <p className="text-gray-300 font-semibold">503.09/2-0145/DPMPTSP/PM/II/2018</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 mb-1">{t.tdp}</p>
                <p className="text-gray-300 font-semibold">100714617395</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 mb-1">{t.domisili}</p>
                <p className="text-gray-300 font-semibold">0007971.01.01. TAHUN 2018</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-1 sm:space-x-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white font-bold text-base sm:text-lg flex items-center justify-center rounded-md transform -skew-x-12">AKS</div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">{companyData.shortName}</h3>
                <p className="text-gray-400 text-xs">{companyData.tagline}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {companyData.name} adalah perusahaan yang bergerak di bidang pembuatan panel listrik, electrical, mechanical, dan supplier komponen industri sejak 2018.
            </p>
            <div className="flex space-x-2 sm:space-x-3">
              <a href={companyData.social.facebook} target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-9 sm:h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 transform hover:scale-110" aria-label="Facebook">
                <span className="w-4 h-4 sm:w-5 sm:h-5">{Icons.facebook}</span>
              </a>
              <a href={companyData.social.instagram} target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-9 sm:h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all duration-300 transform hover:scale-110" aria-label="Instagram">
                <span className="w-4 h-4 sm:w-5 sm:h-5">{Icons.instagram}</span>
              </a>
              <a href={companyData.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-9 sm:h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300 transform hover:scale-110" aria-label="LinkedIn">
                <span className="w-4 h-4 sm:w-5 sm:h-5">{Icons.linkedin}</span>
              </a>
              <a href={companyData.social.youtube} target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-9 sm:h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:scale-110" aria-label="YouTube">
                <span className="w-4 h-4 sm:w-5 sm:h-5">{Icons.youtube}</span>
              </a>
              <a href={`https://wa.me/${companyData.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-9 sm:h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-all duration-300 transform hover:scale-110" aria-label="WhatsApp">
                <span className="w-4 h-4 sm:w-5 sm:h-5">{Icons.whatsapp}</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-blue-400">{t.contact}</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="text-blue-400 mt-1 flex-shrink-0">{Icons.mapPin}</div>
                <div>
                  <p className="text-gray-400 text-xs">{t.address}</p>
                  <p className="text-gray-300 text-sm">{companyData.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-blue-400 flex-shrink-0">{Icons.phone}</div>
                <div>
                  <p className="text-gray-400 text-xs">{t.telp}</p>
                  <a href={`tel:${companyData.phone}`} className="text-gray-300 text-sm hover:text-blue-400">{companyData.phone}</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-blue-400 flex-shrink-0">{Icons.mail}</div>
                <div>
                  <p className="text-gray-400 text-xs">{t.email}</p>
                  <a href={`mailto:${companyData.email}`} className="text-gray-300 text-sm hover:text-blue-400">{companyData.email}</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-green-400 flex-shrink-0">{Icons.whatsapp}</div>
                <div>
                  <p className="text-gray-400 text-xs">WhatsApp</p>
                  <a href={`https://wa.me/${companyData.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-green-400">+{companyData.whatsapp}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4 sm:pt-6">
          <div className="text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              {t.copyright} © {new Date().getFullYear()} {companyData.name}. {t.allRights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
