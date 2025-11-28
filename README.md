# Full Stack E-Commerce Application

Mikro servis mimarisi ile geliştirilmiş tam kapsamlı bir e-ticaret uygulaması. .NET 9 backend API'leri, PostgreSQL veritabanları, Redis cache ve Next.js 14 frontend'den oluşmaktadır.

> **📌 Not**: Bu proje 12 Factor App ilkelerine uygun olarak geliştirilmiştir. Tüm yapılandırma ayarları environment variable'lar üzerinden yönetilmektedir.

## 📋 Proje Kontrol Listesi (2. Aşama Task)

Aşağıda PDF'deki tüm gereksinimlerin karşılandığı kontrol edilmiştir:

### ✅ Backend Gereksinimleri

#### Mimari
- ✅ **Onion Architecture**: Core (Domain) - Application - Infrastructure - API katmanları
- ✅ **CQRS Pattern**: Command/Query ayrımı (MediatR ile)

#### Servisler
- ✅ **Auth Servisi** (Port: 5001)
  - ✅ Kullanıcı kayıt (POST /api/auth/register)
  - ✅ Kullanıcı login (POST /api/auth/login)
  - ✅ JWT token üretimi
  - ✅ Password hashing (BCrypt)

- ✅ **Product Servisi** (Port: 5000)
  - ✅ **Commands** (JWT korumalı):
    - ✅ Ürün ekleme (POST /api/products)
    - ✅ Ürün güncelleme (PUT /api/products/{id})
    - ✅ Ürün silme (DELETE /api/products/{id})
  - ✅ **Queries** (Redis Cache ile):
    - ✅ Ürün listeleme (GET /api/products)
    - ✅ Ürün detay (GET /api/products/{id})
  - ✅ **Cache Invalidation**: Create/Update/Delete işlemlerinde cache temizleme

#### Teknik Özellikler
- ✅ **SOLID Prensipleri**: Dependency Injection, Interface Segregation, Single Responsibility
- ✅ **Global Exception Handling**: Middleware ile
- ✅ **Loglama**: Serilog (file + console)
- ✅ **.NET 9**: En güncel .NET sürümü
- ✅ **PostgreSQL**: Her servis için ayrı veritabanı (AuthDB, ProductDB)
- ✅ **Redis**: Query cache için
- ✅ **JWT Authentication**: Güvenli token tabanlı kimlik doğrulama

### ✅ Frontend Gereksinimleri

#### Teknolojiler
- ✅ **Next.js 14+**: App Router kullanılarak
- ✅ **TypeScript**: Tam tip güvenliği
- ✅ **TailwindCSS**: Modern, responsive tasarım
- ✅ **next-intl**: Çok dilli destek (TR/EN)
- ✅ **Redux Toolkit (RTK)**: Global state yönetimi

#### Fonksiyonel Özellikler
- ✅ **Kimlik Doğrulama**:
  - ✅ Login sayfası (`/tr/login`, `/en/login`)
  - ✅ Register sayfası (`/tr/register`, `/en/register`)
  - ✅ JWT token yönetimi (Cookie + LocalStorage)
  - ✅ Otomatik logout (401 hatalarında)

- ✅ **Ürün Listeleme**:
  - ✅ Grid yapısında gösterim
  - ✅ **Filtreleme**:
    - ✅ Kategoriye göre filtreleme
    - ✅ Fiyat aralığı (min-max)
  - ✅ **Sıralama**:
    - ✅ Fiyata göre (artan/azalan)
    - ✅ İsme göre (A-Z / Z-A)
  - ✅ URL-based filtering (SEO uyumlu)

- ✅ **Ürün Detay**:
  - ✅ Dinamik route (`/products/[id]`)
  - ✅ Server-side rendered
  - ✅ Dinamik meta tags (title, description)
  - ✅ OpenGraph meta tags

- ✅ **Ürün Yönetimi** (Authenticated users):
  - ✅ Ürün ekleme sayfası
  - ✅ Ürün düzenleme sayfası
  - ✅ Ürün silme (onay ile)

- ✅ **Sepet**:
  - ✅ RTK ile global state yönetimi
  - ✅ Sepete ekleme/çıkarma
  - ✅ Miktar güncelleme
  - ✅ Ayrı sepet sayfası (`/tr/cart`, `/en/cart`)
  - ✅ Sepet toplam hesaplama

#### Performans ve SEO
- ✅ **SSR (Server-Side Rendering)**:
  - ✅ Ürün listeleme sayfası
  - ✅ Ürün detay sayfası
- ✅ **ISR (Incremental Static Regeneration)**:
  - ✅ 60 saniye revalidation
- ✅ **Dinamik Meta Tags**:
  - ✅ Ürün adına göre title
  - ✅ Ürün açıklamasına göre description
  - ✅ OpenGraph meta tags
- ✅ **next/image**:
  - ✅ Lazy loading
  - ✅ Otomatik optimizasyon
  - ✅ Responsive images

### ✅ Teslim Beklentileri
- ✅ Çalışır durumda Auth ve Product servisleri
- ✅ Çalışır durumda Next.js uygulaması
- ✅ Kapsamlı README.md dosyası
- 📝 **Branch ve Commitler**: `test/v1.0.0` branch'i oluşturup düzenli commit'ler atınız

### 🎯 Ek Özellikler (İstenmeyen ama eklenen)
- ✅ **Docker Compose**: Tüm altyapı servisleri otomatik kurulum
- ✅ **12 Factor App**: Environment variable'larla yapılandırma
- ✅ **Health Checks**: Container'lar için
- ✅ **CORS Yapılandırması**: Frontend-Backend iletişimi
- ✅ **Error Boundaries**: Graceful error handling
- ✅ **Responsive Design**: Mobile-first yaklaşım
- ✅ **Loading States**: Kullanıcı deneyimi için
- ✅ **Toast Notifications**: İşlem geribildirimler

---

```
.
├── Backend/
│   ├── Auth/                    # Auth Mikro Servisi
│   │   ├── AuthAPI/             # API Layer
│   │   ├── AuthAPI.Domain/       # Domain Entities
│   │   ├── AuthAPI.Application/ # DTOs, Services, Interfaces
│   │   ├── AuthAPI.Infrastructure/ # Repository, DbContext
│   │   └── AuthAPI.sln
│   └── Product/                 # Product Mikro Servisi
│       ├── ProductAPI/          # API Layer
│       ├── ProductAPI.Domain/   # Domain Entities
│       ├── ProductAPI.Application/ # DTOs, Commands, Queries, Handlers
│       ├── ProductAPI.Infrastructure/ # Repository, DbContext, Redis Cache
│       └── ProductAPI.sln
├── Frontend/                    # Next.js 14 App Router
│   ├── app/
│   │   └── [locale]/            # Çok dilli routing (tr, en)
│   ├── lib/
│   │   ├── store.ts             # RTK Store
│   │   ├── features/            # Redux Slices (cart, auth)
│   │   └── api/                 # API Clients
│   └── messages/                # next-intl translations
├── docker-compose.yml            # PostgreSQL ve Redis containers
└── README.md
```

## Mimari Özellikler

### Backend

#### Mikro Servis Mimarisi
- **AuthAPI**: Kullanıcı kayıt ve login işlemleri, JWT token üretimi
- **ProductAPI**: Ürün CRUD işlemleri, CQRS pattern, Redis cache

#### Onion Architecture
- **Domain**: Entity modelleri
- **Application**: Business logic, DTOs, Commands/Queries (CQRS)
- **Infrastructure**: Repository, DbContext, External services (Redis)
- **API**: Controllers, Middleware

#### CQRS Pattern (ProductAPI)
- **Commands**: CreateProduct, UpdateProduct, DeleteProduct (JWT korumalı)
- **Queries**: GetAllProducts (filtreleme/sıralama), GetProductById
- **MediatR**: Command/Query handler'ları için

#### Teknolojiler
- .NET 9
- Entity Framework Core 9
- PostgreSQL (her servis için ayrı veritabanı)
- Redis (cache için)
- JWT Authentication
- Serilog (loglama)
- MediatR (CQRS)

### Frontend

#### Teknolojiler
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- next-intl (çok dilli destek - TR/EN)
- Redux Toolkit (RTK) - State yönetimi
- Axios - API istekleri

#### Özellikler
- Çok dilli destek (Türkçe/İngilizce)
- JWT token yönetimi
- Ürün listeleme, filtreleme, sıralama
- Ürün detay sayfası (SSR, SEO meta tags)
- Sepet yönetimi (RTK)
- Responsive tasarım

## Gereksinimler

### Backend
- **.NET 9 SDK** - [İndir](https://dotnet.microsoft.com/download)
- **Docker & Docker Compose** - PostgreSQL ve Redis için
- **Entity Framework Core Tools**:
  ```bash
  dotnet tool install --global dotnet-ef
  ```

### Frontend
- **Node.js 18+** - [İndir](https://nodejs.org/)
- **npm** veya **yarn**

## 🚀 Hızlı Başlangıç (Quick Start)

### 1. Repository'yi Klonlayın

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Environment Değişkenlerini Yapılandırın

#### Frontend (.env.local)

`Frontend` klasöründe `.env.local` dosyası oluşturun:

```bash
cd Frontend
cp env.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
# Backend API URLs (Client-side)
NEXT_PUBLIC_AUTH_API_URL=http://localhost:5001/api
NEXT_PUBLIC_PRODUCT_API_URL=http://localhost:5000/api

# Backend API URLs (Server-side - For SSR/SSG)
AUTH_API_URL=http://localhost:5001/api
PRODUCT_API_URL=http://localhost:5000/api
```

#### Backend - AuthAPI (.env)

`Backend/Auth/AuthAPI` klasöründe `.env` dosyası oluşturun:

```bash
cd Backend/Auth/AuthAPI
```

`.env` dosyası içeriği:

```env
# Database Configuration
ConnectionStrings__AuthConnection=Host=localhost;Port=5433;Database=AuthDB;Username=postgres;Password=postgres

# JWT Configuration (ÖNEMLİ: Production'da güvenli bir key kullanın!)
Jwt__Key=YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast32CharactersLong
Jwt__Issuer=AuthAPI
Jwt__Audience=AuthAPI
Jwt__ExpiryMinutes=60

# Application Configuration
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:5001
```

#### Backend - ProductAPI (.env)

`Backend/Product/ProductAPI` klasöründe `.env` dosyası oluşturun:

```bash
cd Backend/Product/ProductAPI
```

`.env` dosyası içeriği:

```env
# Database Configuration
ConnectionStrings__ProductConnection=Host=localhost;Port=5432;Database=ProductDB;Username=postgres;Password=postgres
ConnectionStrings__Redis=localhost:6379

# JWT Configuration (AuthAPI ile aynı olmalı!)
Jwt__Key=YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast32CharactersLong
Jwt__Issuer=AuthAPI
Jwt__Audience=AuthAPI

# Application Configuration
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:5000
```

> **⚠️ UYARI**: `.env` dosyaları `.gitignore`'da bulunduğundan Git'e push edilmez. Production ortamında mutlaka güvenli değerler kullanın!

### 3. Docker Container'ları Başlatın

Proje kök dizininde:

```bash
docker-compose up -d
```

Bu komut şunları başlatır:
- **PostgreSQL (ProductDB)**: Port 5432
- **PostgreSQL (AuthDB)**: Port 5433  
- **Redis Cache**: Port 6379

Container durumunu kontrol edin:

```bash
docker-compose ps
```

Tüm container'lar **healthy** durumunda olmalıdır.

### 4. Backend - AuthAPI Kurulumu

```bash
cd Backend/Auth
```

**Database Migration'larını Uygulayın:**

```bash
cd AuthAPI
dotnet ef migrations add InitialCreate --project ../AuthAPI.Infrastructure --startup-project .
dotnet ef database update --project ../AuthAPI.Infrastructure --startup-project .
```

**AuthAPI'yi Çalıştırın:**

```bash
dotnet run
```

✅ API: `http://localhost:5001`  
✅ Swagger UI: `http://localhost:5001/swagger`

### 5. Backend - ProductAPI Kurulumu

Yeni bir terminal açın:

```bash
cd Backend/Product
```

**Database Migration'larını Uygulayın:**

```bash
cd ProductAPI
dotnet ef migrations add InitialCreate --project ../ProductAPI.Infrastructure --startup-project .
dotnet ef database update --project ../ProductAPI.Infrastructure --startup-project .
```

**ProductAPI'yi Çalıştırın:**

```bash
dotnet run
```

✅ API: `http://localhost:5000`  
✅ Swagger UI: `http://localhost:5000/swagger`

### 6. Frontend Kurulumu

Yeni bir terminal açın:

```bash
cd Frontend
```

**Bağımlılıkları Yükleyin:**

```bash
npm install
```

**Development Server'ı Başlatın:**

```bash
npm run dev
```

✅ Uygulama: `http://localhost:3000`  
✅ Türkçe: `http://localhost:3000/tr`  
✅ İngilizce: `http://localhost:3000/en`

### 7. İlk Kullanıcıyı Oluşturun

1. `http://localhost:3000/tr` adresine gidin
2. **"Kayıt Ol"** butonuna tıklayın
3. Kullanıcı bilgilerinizi girin
4. Giriş yapın ve ürün eklemeye başlayın!

## 📝 Environment Değişkenleri Detayları

### Frontend Environment Variables

| Değişken | Açıklama | Örnek |
|----------|----------|-------|
| `NEXT_PUBLIC_AUTH_API_URL` | AuthAPI URL (Client-side) | `http://localhost:5001/api` |
| `NEXT_PUBLIC_PRODUCT_API_URL` | ProductAPI URL (Client-side) | `http://localhost:5000/api` |
| `AUTH_API_URL` | AuthAPI URL (Server-side SSR) | `http://localhost:5001/api` |
| `PRODUCT_API_URL` | ProductAPI URL (Server-side SSR) | `http://localhost:5000/api` |

> **Not**: `NEXT_PUBLIC_` prefix'li değişkenler browser'da erişilebilir. Hassas bilgiler içermemeli!

### Backend Environment Variables

#### Veritabanı Yapılandırması

```env
# .NET'te nested configuration için __ (double underscore) kullanılır
ConnectionStrings__AuthConnection=Host=localhost;Port=5433;Database=AuthDB;Username=postgres;Password=postgres
ConnectionStrings__ProductConnection=Host=localhost;Port=5432;Database=ProductDB;Username=postgres;Password=postgres
ConnectionStrings__Redis=localhost:6379
```

#### JWT Yapılandırması

```env
Jwt__Key=<en-az-32-karakter-uzunluğunda-güvenli-key>
Jwt__Issuer=AuthAPI
Jwt__Audience=AuthAPI
Jwt__ExpiryMinutes=60
```

> **🔐 Güvenlik**: Production'da `Jwt__Key` mutlaka güvenli, uzun ve rastgele olmalıdır!

#### Application Yapılandırması

```env
ASPNETCORE_ENVIRONMENT=Development  # Production, Staging vb.
ASPNETCORE_URLS=http://+:5000      # Dinlenecek port
```

## ⚙️ Yapılandırma (12 Factor App)

Proje, [12 Factor App](https://12factor.net/) metodolojisine uygun olarak geliştirilmiştir. Tüm yapılandırma ayarları environment variable'lar üzerinden yönetilmektedir.

### Neden 12 Factor App?

- **Taşınabilirlik**: Farklı ortamlarda (dev, staging, prod) aynı kod çalışır
- **Güvenlik**: Hassas bilgiler (şifreler, API anahtarları) kodda saklanmaz
- **Ölçeklenebilirlik**: Yapılandırma değişikliği için kod değişikliği gerekmez
- **CI/CD Uyumluluğu**: Otomatik deployment süreçleriyle uyumlu

### Backend (.NET) Environment Variables

.NET'te environment variable'lar şu öncelik sırasıyla okunur:
1. İşletim sistemi environment variables
2. `.env` dosyası (dotnet-env paketi ile)
3. `appsettings.json` dosyası

**Nested configuration** için `__` (double underscore) kullanılır:

```env
# appsettings.json'daki ConnectionStrings.ProductConnection karşılığı:
ConnectionStrings__ProductConnection=Host=localhost;...

# appsettings.json'daki Jwt.Key karşılığı:
Jwt__Key=SecretKey
```

### Frontend (Next.js) Environment Variables

Next.js'te iki tip environment variable vardır:

1. **`NEXT_PUBLIC_*`**: Browser'da erişilebilir (client-side)
   ```env
   NEXT_PUBLIC_PRODUCT_API_URL=http://localhost:5000/api
   ```

2. **Normal variables**: Sadece server-side'da erişilebilir
   ```env
   PRODUCT_API_URL=http://localhost:5000/api
   ```

> **⚠️ Güvenlik**: Hassas bilgileri asla `NEXT_PUBLIC_` prefix'i ile kullanmayın!

## 🐳 Docker Yapılandırması

`docker-compose.yml` dosyası tüm altyapı servislerini içerir:

```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları görüntüle
docker-compose logs -f

# Belirli bir servisin loglarını görüntüle
docker-compose logs -f postgres-product

# Servisleri durdur
docker-compose down

# Tüm verileri sil (DİKKAT!)
docker-compose down -v

# Container durumunu kontrol et
docker-compose ps

# Bir servisi yeniden başlat
docker-compose restart redis-product
```

### Container Health Checks

Tüm container'lar health check'e sahiptir:

- **PostgreSQL**: `pg_isready` komutu ile
- **Redis**: `redis-cli ping` komutu ile

Container'lar **healthy** duruma gelene kadar bekleyin.

## 🧪 Test Etme

### Backend API'lerini Test Etme

#### Swagger UI Kullanarak

1. **AuthAPI**: `http://localhost:5001/swagger`
2. **ProductAPI**: `http://localhost:5000/swagger`

#### cURL ile Test

**Kullanıcı Kayıt:**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Kullanıcı Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Ürün Listeleme:**
```bash
curl http://localhost:5000/api/products
```

**Ürün Ekleme (JWT Token gerekli):**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Ürün",
    "description": "Test açıklama",
    "price": 99.99,
    "category": "Elektronik",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

### Frontend Test Etme

1. Ana sayfa: `http://localhost:3000`
2. Türkçe: `http://localhost:3000/tr`
3. İngilizce: `http://localhost:3000/en`
4. Ürünler: `http://localhost:3000/tr/products`
5. Sepet: `http://localhost:3000/tr/cart`

### Redis Cache Test Etme

```bash
# Redis container'a bağlan
docker exec -it product-redis redis-cli

# Tüm cache key'leri listele
KEYS *

# Belirli bir key'in değerini görüntüle
GET "products_"

# Cache'i temizle
FLUSHALL

# Redis'ten çık
exit
```

### PostgreSQL Test Etme

**ProductDB'ye Bağlan:**
```bash
docker exec -it product-postgres psql -U postgres -d ProductDB

# Tabloları listele
\dt

# Ürünleri görüntüle
SELECT * FROM "Products";

# Çıkış
\q
```

**AuthDB'ye Bağlan:**
```bash
docker exec -it auth-postgres psql -U postgres -d AuthDB

# Kullanıcıları görüntüle
SELECT * FROM "Users";
```

## 🔍 Mimari Kararlar

### Backend

#### 1. Neden Mikro Servis Mimarisi?

- **Bağımsız Dağıtım**: Her servis bağımsız deploy edilebilir
- **Teknoloji Çeşitliliği**: Her servis farklı teknoloji kullanabilir
- **Ölçeklenebilirlik**: Servisler bağımsız ölçeklenebilir
- **Hata İzolasyonu**: Bir servisteki hata diğerlerini etkilemez

#### 2. Neden CQRS Pattern?

- **Performans**: Read işlemleri cache'den, Write işlemleri doğrudan DB'den
- **Ölçeklenebilirlik**: Query ve Command'lar bağımsız ölçeklenebilir
- **Bakım Kolaylığı**: Business logic daha net ayrılır
- **Cache Stratejisi**: Query'ler cache'lenirken, Command'lar cache'i invalidate eder

#### 3. Neden Redis Cache?

- **Performans**: In-memory cache, DB'den 10-100x daha hızlı
- **Dağıtık Sistemler**: Birden fazla instance arasında paylaşılabilir
- **TTL Desteği**: Otomatik cache expiration
- **Veri Yapıları**: String, List, Set, Hash gibi zengin veri yapıları

#### 4. Neden Onion Architecture?

- **Bağımlılık Yönü**: Dış katmanlar içe bağımlı (Domain bağımsız)
- **Test Edilebilirlik**: Business logic kolay test edilir
- **Değiştirilebilirlik**: Infrastructure değişikliği Domain'i etkilemez
- **SOLID Prensipleri**: Doğal olarak SOLID prensiplerine uyar

### Frontend

#### 1. Neden Next.js App Router?

- **Server Components**: Performans ve SEO
- **Streaming SSR**: Daha hızlı ilk render
- **Nested Layouts**: Kod tekrarını azaltır
- **Route Handlers**: API endpoint'leri framework içinde

#### 2. Neden Redux Toolkit?

- **Global State**: Sepet gibi global state yönetimi
- **DevTools**: Zaman yolculuğu debugging
- **Middleware**: Async işlemler için
- **TypeScript Desteği**: Tam tip güvenliği

#### 3. Neden next-intl?

- **SSR Uyumlu**: Server component'lerde çalışır
- **Type-Safe**: TypeScript desteği
- **SEO**: Arama motorları için optimize
- **URL-based**: `/tr` ve `/en` gibi clean URL'ler

#### 4. Neden TailwindCSS?

- **Utility-First**: Hızlı geliştirme
- **Tree-Shaking**: Kullanılmayan CSS'ler kaldırılır
- **Responsive**: Mobile-first yaklaşım
- **Özelleştirilebilir**: Tam kontrol

## 📊 Performans Optimizasyonları

### Backend
- ✅ Redis cache (10 dakika TTL)
- ✅ Connection pooling (EF Core)
- ✅ Async/await everywhere
- ✅ Index'ler (Category, Price)
- ✅ Pagination hazır altyapı

### Frontend
- ✅ SSR/ISR (60s revalidation)
- ✅ next/image lazy loading
- ✅ Code splitting (otomatik)
- ✅ Client-side caching
- ✅ Prefetching (Next.js Link)

## 📝 Geliştirme Notları

### Git Workflow

Proje için önerilen branch yapısı:

```bash
# Yeni özellik branch'i oluştur
git checkout -b test/v1.0.0

# Değişiklikleri commit et
git add .
git commit -m "feat: ürün filtreleme eklendi"

# Branch'i push et
git push origin test/v1.0.0
```

### Commit Message Standartları

```bash
feat: Yeni özellik ekleme
fix: Bug düzeltme
docs: Dokümantasyon değişikliği
style: Kod formatı (logic değişikliği yok)
refactor: Kod iyileştirme (logic değişikliği yok)
test: Test ekleme/düzeltme
chore: Build/tool yapılandırması
```

### Veritabanı Migration'ları

**Yeni migration oluşturma:**
```bash
cd Backend/Product/ProductAPI
dotnet ef migrations add MigrationName --project ../ProductAPI.Infrastructure --startup-project .
```

**Migration'ı uygulama:**
```bash
dotnet ef database update --project ../ProductAPI.Infrastructure --startup-project .
```

**Migration'ı geri alma:**
```bash
dotnet ef database update PreviousMigrationName --project ../ProductAPI.Infrastructure --startup-project .
```

**Tüm migration'ları silme (DİKKAT!):**
```bash
dotnet ef database drop --project ../ProductAPI.Infrastructure --startup-project .
```

## API Endpoints

### AuthAPI (Port: 5001)

#### POST /api/auth/register
Kullanıcı kaydı

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### POST /api/auth/login
Kullanıcı girişi

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### ProductAPI (Port: 5000)

#### GET /api/products
Tüm ürünleri listeler (Query - Cache ile)

**Query Parameters:**
- `category`: Kategoriye göre filtreleme
- `minPrice`: Minimum fiyat
- `maxPrice`: Maximum fiyat
- `sortBy`: Sıralama (`price_asc`, `price_desc`, `name_asc`, `name_desc`)

#### GET /api/products/{id}
Belirli bir ürünü getirir (Query - Cache ile)

#### POST /api/products
Yeni bir ürün oluşturur (Command - JWT gerekli)

**Request Body:**
```json
{
  "name": "Ürün Adı",
  "description": "Ürün Açıklaması",
  "price": 99.99,
  "category": "Elektronik",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### PUT /api/products/{id}
Bir ürünü günceller (Command - JWT gerekli)

#### DELETE /api/products/{id}
Bir ürünü siler (Command - JWT gerekli)

## Özellikler

### Backend

- ✅ Mikro servis mimarisi (AuthAPI, ProductAPI)
- ✅ Onion Architecture
- ✅ CQRS Pattern (MediatR)
- ✅ Redis Cache (Query'ler için)
- ✅ Cache Invalidation (Create/Update/Delete işlemlerinde)
- ✅ JWT Authentication
- ✅ Serilog loglama
- ✅ Global exception handling
- ✅ SOLID prensipleri
- ✅ Her servis için ayrı veritabanı

### Frontend

- ✅ Next.js 14 App Router
- ✅ Çok dilli destek (next-intl - TR/EN)
- ✅ Redux Toolkit (RTK) - State yönetimi
- ✅ JWT token yönetimi
- ✅ Ürün listeleme (SSR/ISR ile SEO uyumlu)
- ✅ Filtreleme (kategori, fiyat aralığı)
- ✅ Sıralama (fiyat, isim)
- ✅ Ürün detay sayfası (SSR, SEO meta tags)
- ✅ Sepet yönetimi
- ✅ Responsive tasarım
- ✅ next/image ile lazy loading
- ✅ URL-based filtering (SEO dostu URL yapısı)

## Veritabanı Yapısı

### AuthDB (AuthAPI)
- **Users**: Kullanıcı bilgileri (Email, PasswordHash, FirstName, LastName)

### ProductDB (ProductAPI)
- **Products**: Ürün bilgileri (Name, Description, Price, Category, ImageUrl)

## Cache Stratejisi

- **GetAllProducts**: Cache key: `products_{category}_{minPrice}_{maxPrice}_{sortBy}` (10 dakika TTL)
- **GetProductById**: Cache key: `product_{id}` (10 dakika TTL)
- **Cache Invalidation**: Create/Update/Delete işlemlerinde ilgili cache'ler temizlenir

## Güvenlik

- JWT token authentication (ProductAPI Commands için)
- Password hashing (BCrypt)
- CORS yapılandırması
- Input validation

## Sorun Giderme

### Backend çalışmıyor
- .NET SDK'nın yüklü olduğundan emin olun: `dotnet --version`
- Docker container'ların çalıştığından emin olun: `docker-compose ps`
- PostgreSQL container'larını başlatın: `docker-compose up -d`
- Veritabanı bağlantı string'lerini kontrol edin
- Migration'ların uygulandığından emin olun

### Frontend çalışmıyor
- Node.js'in yüklü olduğundan emin olun: `node --version`
- `node_modules` klasörünü silip `npm install` komutunu tekrar çalıştırın
- `.env.local` dosyasının doğru yapılandırıldığından emin olun

### CORS hatası
- Backend'lerin çalıştığından emin olun
- `Program.cs` dosyalarındaki CORS ayarlarını kontrol edin
- Frontend'in doğru API URL'lerini kullandığından emin olun

### Redis bağlantı hatası
- Redis container'ın çalıştığından emin olun: `docker-compose ps`
- Redis connection string'ini kontrol edin
- Redis çalışmıyorsa, uygulama graceful degradation ile çalışmaya devam eder (cache olmadan)

## Geliştirme Notları

- Her mikro servis bağımsız olarak deploy edilebilir
- Her servis kendi veritabanına sahiptir (Database per Service pattern)
- CQRS pattern sayesinde Command ve Query işlemleri ayrılmıştır
- Redis cache sayesinde Query performansı artırılmıştır
- Frontend'de RTK ile global state yönetimi yapılmaktadır
- next-intl ile çok dilli destek sağlanmaktadır

## Lisans

Bu proje eğitim amaçlıdır.
