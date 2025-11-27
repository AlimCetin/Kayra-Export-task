# Frontend Library Structure

Bu klasör, uygulamanın tüm paylaşılan kodlarını içerir. Senior seviyesinde bir mimari yapı kullanılmıştır.

## Klasör Yapısı

```
lib/
├── types/           # TypeScript type ve interface tanımlamaları
├── constants/       # Sabitler (routes, API config, vb.)
├── services/        # API servisleri
├── hooks/           # Custom React hooks
├── components/      # Yeniden kullanılabilir UI bileşenleri
└── utils/           # Yardımcı fonksiyonlar
```

## Klasör Açıklamaları

### `types/`
TypeScript type ve interface tanımlamaları. Her domain için ayrı dosyalar.

**Örnek:** `product.types.ts` - Product ile ilgili tüm tipler

### `constants/`
Uygulama genelinde kullanılan sabitler.

- `routes.ts` - Tüm route tanımlamaları (merkezi yönetim)
- `api.ts` - API URL'leri ve endpoint'ler

### `services/`
API çağrılarını yöneten servis sınıfları. Her domain için ayrı servis.

**Örnek:** `product.service.ts` - Product API işlemleri

**Kullanım:**
```typescript
import { ProductService } from '@/lib/services/product.service'

const products = await ProductService.getAll()
```

### `hooks/`
Custom React hooks. State yönetimi ve side effect'ler için.

**Örnekler:**
- `useProducts.ts` - Ürün listesi yönetimi
- `useProductOperations.ts` - Ürün CRUD işlemleri

**Kullanım:**
```typescript
import { useProducts } from '@/lib/hooks/useProducts'

const { products, loading, error, refetch } = useProducts()
```

### `components/`
Yeniden kullanılabilir UI bileşenleri.

**Örnekler:**
- `LoadingSpinner.tsx` - Loading göstergesi
- `ErrorDisplay.tsx` - Hata mesajı gösterimi
- `ProductCard.tsx` - Ürün kartı
- `ProductModal.tsx` - Ürün düzenleme modal'ı
- `DeleteConfirmModal.tsx` - Silme onay modal'ı
- `ProductSortBar.tsx` - Sıralama çubuğu

### `utils/`
Yardımcı fonksiyonlar ve utility'ler.

**Örnek:** `sort.utils.ts` - Sıralama fonksiyonları

## Best Practices

1. **Separation of Concerns**: Her klasör kendi sorumluluğuna sahiptir
2. **Single Responsibility**: Her dosya tek bir sorumluluğa sahiptir
3. **Reusability**: Bileşenler ve fonksiyonlar yeniden kullanılabilir olmalı
4. **Type Safety**: Tüm kod TypeScript ile tip güvenli
5. **Centralized Configuration**: Route'lar ve API URL'leri merkezi yönetilir

## Yeni Özellik Ekleme

1. **Type tanımla**: `types/` klasörüne yeni type dosyası ekle
2. **Service oluştur**: `services/` klasörüne API servisi ekle
3. **Hook oluştur**: `hooks/` klasörüne custom hook ekle
4. **Component oluştur**: `components/` klasörüne UI bileşeni ekle
5. **Route ekle**: `constants/routes.ts` dosyasına yeni route ekle

## Örnek: Yeni Bir Domain Ekleme

Örneğin "Category" domain'i eklemek istiyorsanız:

1. `types/category.types.ts` - Category tipleri
2. `services/category.service.ts` - Category API servisi
3. `hooks/useCategories.ts` - Category hook'u
4. `components/CategoryCard.tsx` - Category bileşeni
5. `constants/routes.ts` - Category route'ları ekle


