# İç Denetim Chatbot UI

Bu proje, AnythingLLM tabanlı iç denetim chatbotu için animasyonlu bir kullanıcı arayüzü içerir.

## Özellikler

- SVG tabanlı animasyonlu robot karakteri
- Konuşma sırasında göz, ağız ve kol animasyonları
- Text-to-Speech entegrasyonu
- Duygu durumlarına göre farklı animasyonlar
- Mobil uyumlu tasarım
- TypeScript ile tip güvenliği

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm start
```

## Kullanım

EilikBot bileşeni şu prop'ları kabul eder:

- `message`: Konuşulacak metin
- `isSpeaking`: Konuşma durumu
- `emotion`: Duygu durumu ('happy', 'sad', 'excited', 'neutral')

Örnek kullanım:

```tsx
<EilikBot 
  message="Merhaba, size nasıl yardımcı olabilirim?"
  isSpeaking={true}
  emotion="happy"
/>
```

## Geliştirme

Yeni animasyonlar eklemek için:

1. `EilikBot.tsx` içindeki ilgili SVG elementlerini düzenleyin
2. Yeni animasyon varyantları ekleyin
3. Duygu durumlarına göre farklı animasyonlar tanımlayın

## Lisans

MIT 