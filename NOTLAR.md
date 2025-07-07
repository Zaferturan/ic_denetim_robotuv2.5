# Proje Notları ve Kurulum Rehberi

## Projeyi Başka Bir Bilgisayarda Kurmak İçin

1. **Projeyi GitHub'dan klonla:**
   ```sh
   git clone https://github.com/Zaferturan/ic_denetim_robotuv2.5.git
   cd ic_denetim_robotuv2.5
   ```

2. **Node.js ve npm kurulu olmalı.**
   - [Node.js İndir](https://nodejs.org/)

3. **Tüm bağımlılıkları yükle:**
   ```sh
   npm install
   ```

4. **Geliştirme sunucusunu başlat:**
   ```sh
   npm start
   ```

5. **.env dosyasını oluşturmayı unutma!**
   - Gerekli API anahtarlarını ve ortam değişkenlerini .env dosyasına ekle.

## Docker ile Çalıştırmak İçin

1. **Docker kurulu olmalı.**
2. **Image'ı çek veya build et:**
   ```sh
   docker pull zaferturan/ic_denetim_robotu:icdenetimv2
   # veya
   docker build -t zaferturan/ic_denetim_robotu:icdenetimv2 .
   ```
3. **Container başlat:**
   ```sh
   docker run -p 80:80 zaferturan/ic_denetim_robotu:icdenetimv2
   ```

## Cursor ile Çalışırken
- Bu proje Cursor ile yönetildi.
- Kod geçmişi, önemli komutlar ve notlar bu dosyada tutulabilir.
- Kendi özel notlarını buraya ekleyebilirsin.

---

Herhangi bir sorunda bu dosyaya bakabilir veya yeni notlar ekleyebilirsin. 