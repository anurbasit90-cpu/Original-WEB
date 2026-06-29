# PT. ARYATEK KONTROL SEJAHTERA - Website

## 🚀 Quick Start

### Install & Jalankan
```bash
npm install
npm run dev
```
Buka [http://localhost:5173](http://localhost:5173)


### Struktur Folder
- `src/` - Source code React
- `public/` - Static files (gambar, favicon, dsb)
- `public/favicon/` - Semua favicon dan icon website (ganti dengan logo perusahaan Anda)
- `README.md` - Dokumentasi utama
## 🎨 Update Favicon & Icons

Untuk branding maksimal, ganti semua file di folder `public/favicon/` dengan favicon/logo perusahaan Anda.

- Format yang disarankan: `.ico`, `.png`, `.svg` (ukuran 16x16, 32x32, 192x192, 512x512, dsb)
- Edit juga file `public/site.webmanifest` jika ingin menyesuaikan icon PWA.
- Pastikan referensi favicon di `index.html` sudah sesuai.

## 🌐 Deployment

### Vercel
1. Push ke GitHub
2. Import ke Vercel
3. Deploy

### cPanel/Domainesia
1. `npm run build`
2. Upload isi `dist/` ke `public_html/`
3. Pastikan `.htaccess` sudah benar


## 🔑 Environment Variables

Project ini membutuhkan environment variable berikut:

- `VITE_WP_API_BASE` - Base URL untuk WordPress REST API (Contoh: `https://admin.aryatek.co.id/wp-json/wp/v2`)
	- Tambahkan di file `.env` pada root project:
		```env
		VITE_WP_API_BASE=https://admin.aryatek.co.id/wp-json/wp/v2
		```

## 🔄 WordPress Integration

- Data produk, layanan, portfolio diambil dari WP Headless API
- Endpoint: `${VITE_WP_API_BASE}/...`

## ✅ Checklist

- [x] Multi-language
- [x] Responsive
- [x] SEO optimized
- [x] Contact form ready

## 📞 Kontak
- Email: arifin@aryatech.co.id
- WhatsApp: +62 813-1144-0029

---

**Selengkapnya lihat dokumentasi di atas.**
