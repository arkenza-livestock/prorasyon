# 🌾 ProRasyon — Kurulum Rehberi

React + Vite + Supabase + Vercel stack ile profesyonel SaaS kurulumu.

---

## 1. Supabase Kurulumu

1. [supabase.com](https://supabase.com) > New Project oluştur
2. **SQL Editor** > **New Query** > `supabase/schema.sql` içeriğini yapıştır > **Run**
3. **Settings > API** bölümünden al:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon / public` key → `VITE_SUPABASE_ANON_KEY`
4. **Authentication > Email** → "Confirm email" istersen kapat (geliştirme için)

---

## 2. Frontend Kurulumu (Lokal)

```bash
cd frontend
cp .env.example .env
# .env dosyasını düzenle, Supabase bilgilerini gir

npm install
npm run dev
# http://localhost:5173
```

---

## 3. Vercel Deploy

### GitHub'a yükle
```bash
git init
git add .
git commit -m "ProRasyon ilk sürüm"
git branch -M main
git remote add origin https://github.com/KULLANICI/prorasyon.git
git push -u origin main
```

### Vercel bağlantısı
1. [vercel.com](https://vercel.com) > New Project > GitHub repo seç
2. **Root Directory** → `frontend` seç
3. **Environment Variables** ekle:
   - `VITE_SUPABASE_URL` = `https://xxxxx.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJxxx...`
4. Deploy et

---

## 4. Domain Bağlama (.com.tr)

### Natro / Turhost / Diğer kayıt firmaları
1. Vercel > Proje > **Settings > Domains** > domain ekle: `prorasyon.com.tr`
2. Vercel sana 2 DNS kaydı verir:
   - `A` kaydı: `76.76.21.21`
   - `CNAME` kaydı: `cname.vercel-dns.com`
3. Domain kayıt firması panelinde bu kayıtları ekle
4. 24-48 saat içinde yayılır, SSL otomatik gelir

---

## 5. İlk Admin Kullanıcısı

1. Kayıt ol → giriş yap
2. Supabase Dashboard > **Table Editor** > `profiles`
3. Kendi kullanıcı satırını bul
4. `role` alanını `admin` yap
5. Artık `/admin` sayfasına erişebilirsin

---

## Proje Yapısı

```
prorasyon/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/Layout.jsx     ← Sidebar + mobil nav
│   │   │   └── ui/FarmHeader.jsx     ← Çiftlik/grup seçici
│   │   ├── hooks/
│   │   │   ├── useAuth.jsx           ← Firebase benzeri auth context
│   │   │   └── useFarm.jsx           ← Çiftlik/grup state + Supabase
│   │   ├── lib/
│   │   │   ├── supabase.js           ← Supabase client
│   │   │   └── utils.js              ← Hesaplama fonksiyonları
│   │   ├── pages/
│   │   │   ├── auth/                 ← Login + Register
│   │   │   ├── dashboard/            ← Ana panel
│   │   │   ├── rasyon/               ← Yem yönetimi
│   │   │   ├── tartim/               ← Tartım kayıtları
│   │   │   ├── gider/                ← Gider defteri
│   │   │   ├── kar/                  ← Kâr analizi + grafikler
│   │   │   ├── raporlar/             ← Word/Excel export
│   │   │   └── admin/                ← Kullanıcı yönetimi
│   │   └── styles/global.css
│   ├── package.json
│   └── vite.config.js
└── supabase/
    └── schema.sql                    ← Tüm tablolar + RLS + trigger
```

---

## Özellikler

- ✅ Supabase Auth (email + şifre)
- ✅ Row Level Security — her kullanıcı sadece kendi verisini görür
- ✅ Çok çiftlik / çok grup desteği
- ✅ Rasyon hesaplama — tamamen özelleştirilebilir
- ✅ Tartım kayıtları — FCR, günlük artış hesabı
- ✅ Gider defteri — 8 ay × çiftlik geneli
- ✅ Kâr analizi — başa baş, ROI, kâr marjı
- ✅ Word + Excel rapor indirme
- ✅ Admin paneli — kullanıcı yönetimi
- ✅ Mobil uyumlu
- ✅ Vercel deploy hazır

---

## İleride Eklenebilecekler

- [ ] İyzico ödeme + abonelik sistemi
- [ ] E-posta bildirimleri (Supabase Edge Functions)
- [ ] Grafiksel tartım trendi sayfası
- [ ] Yem fiyatı geçmişi
- [ ] Çoklu kullanıcı (ekip) desteği
