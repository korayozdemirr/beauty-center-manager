# Güzellik Salonu Randevu Sistemi

Güzellik salonları için müşteri yönetimi ve takvim özelliklerine sahip kapsamlı bir randevu yönetim sistemi.

## Özellikler

- Yönetici kimlik doğrulama
- Müşteri yönetimi (CRUD işlemleri)
- Takvim görünümüyle randevu planlama
- Kadınsı renk şemasıyla duyarlı tasarım

## Teknoloji Yığını

- React (Vite)
- Firebase (Kimlik Doğrulama & Firestore)
- Tailwind CSS

## Kurulum Talimatları

1. Depoyu klonlayın
2. Bağımlılıkları yükleyin:
   ```
   npm install
   ```

3. Firebase'i ayarlayın:
   - https://console.firebase.google.com/ adresinde bir Firebase projesi oluşturun
   - Firebase yapılandırmanızı kopyalayın
   - Kök dizinde Firebase kimlik bilgilerinizle bir `.env` dosyası oluşturun:
     ```
     VITE_FIREBASE_API_KEY=api_anhtarınız
     VITE_FIREBASE_AUTH_DOMAIN=auth_domaininiz
     VITE_FIREBASE_PROJECT_ID=proje_idniz
     VITE_FIREBASE_STORAGE_BUCKET=storage_bucketiniz
     VITE_FIREBASE_MESSAGING_SENDER_ID=messaging_sender_idniz
     VITE_FIREBASE_APP_ID=app_idniz
     ```

4. Geliştirme sunucusunu çalıştırın:
   ```
   npm run dev
   ```

## Kullanım

1. Yönetici kimlik bilgilerinizle giriş yapın
2. "Müşteriler" bölümünde müşterileri yönetin
3. "Randevular" bölümünde randevuları planlayın ve yönetin
4. Ana sayfada panel istatistiklerini görüntüleyin

## Proje Yapısı

```
src/
├── components/     # Yeniden kullanılabilir UI bileşenleri
├── firebase/       # Firebase yapılandırması ve başlatma
├── services/       # Müşteriler ve randevular için iş mantığı
├── App.jsx         # Ana uygulama bileşeni
└── main.jsx        # Uygulama giriş noktası
```

## Mevcut Komut Dosyaları

- `npm run dev` - Geliştirme sunucusunu başlat
- `npm run build` - Üretim için derle
- `npm run preview` - Üretim derlemesini önizle# guzellik-merkezi-yonetici
