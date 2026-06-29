import React, { useState } from 'react';
import Icons from '../components/Icons';
import { companyData } from '../constants/companyData';

const PageContainer = ({ children }) => (
  <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16 animate-fade-in">{children}</div>
);

export default function ContactPage({ t }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validateEmail = (email) => /.+@.+\..+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError(t.required);
      return;
    }
    if (!validateEmail(form.email)) {
      setError(t.invalidEmail);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://formsubmit.co/ajax/arifin@aryatek.co.id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `New Contact from ${form.name} - Aryatek Website`,
          _template: 'table',
          _captcha: 'false',
          _cc: '',
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess(t.sent);
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setSuccess(''), 5000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      // Form submission error: err
      setError(t.contactFallback || 'Gagal mengirim pesan. Silakan coba via WhatsApp atau email langsung.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    const message = t.whatsappTemplate || `Halo ${companyData.name}, saya ingin menanyakan tentang produk dan layanan panel listrik Anda.`;
    const whatsappUrl = `https://wa.me/${companyData.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">{t.contactTitle}</h2>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-3">
                <div className="text-green-500 w-12 h-12 flex items-center justify-center">{Icons.whatsapp}</div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">{t.quickResponse || 'Butuh Respon Cepat?'}</h3>
                <p className="text-green-100">{t.whatsappCallout || 'Chat dengan kami langsung di WhatsApp untuk bantuan lebih cepat'}</p>
              </div>
            </div>
            <button onClick={handleWhatsAppClick} className="bg-white text-green-600 font-bold py-3 px-6 rounded-lg hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
              <span className="w-5 h-5">{Icons.whatsapp}</span>
              {t.chatOnWhatsApp || 'Chat di WhatsApp'}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-[#003366]">{t.sendMessage || 'Kirim Pesan'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder={t.name} className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder={t.email} className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              <textarea name="message" value={form.message} onChange={handleChange} placeholder={t.message} className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={5} required />
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
              {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 rounded font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.sending || 'Mengirim...'}
                  </>
                ) : (
                  t.sendMessage
                )}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg overflow-hidden">
              <h3 className="text-xl font-bold p-6 pb-4 text-[#003366]">{t.ourLocation || 'Lokasi Kami'}</h3>
              <div className="w-full h-80">
                <iframe
                  src={companyData.mapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="PT. Aryatek Kontrol Sejahtera Location"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
