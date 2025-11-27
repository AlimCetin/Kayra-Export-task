# Full Stack Developer - 1. Aşama Task

Bu proje, katmanlı mimari ile geliştirilmiş bir .NET backend API'si ve Next.js frontend uygulamasından oluşmaktadır.

## Proje Yapısı

```
task/
├── Backend/
│   ├── ProductAPI/              # Ana API projesi
│   ├── ProductAPI.Domain/       # Domain entities
│   ├── ProductAPI.Application/  # DTOs, Services, Interfaces
│   └── ProductAPI.Infrastructure/ # Repository, DbContext
├── Frontend/                     # Next.js uygulaması
└── README.md
```

## Gereksinimler

### Backend
- .NET 9 SDK
- Docker ve Docker Compose (PostgreSQL için)
- Entity Framework Core Tools

### Frontend
- Node.js 18+ 
- npm veya yarn

## Kurulum ve Çalıştırma

### Docker ile PostgreSQL Kurulumu

1. **Docker ve Docker Compose'u yükleyin** (eğer yüklü değilse):
   - [Docker Desktop](https://www.docker.com/products/docker-desktop) indirin ve yükleyin

2. **PostgreSQL container'ını başlatın**:
   ```bash
   docker-compose up -d
   ```
   
   Bu komut PostgreSQL veritabanını Docker container olarak başlatacaktır.
   - Port: 5432
   - Database: ProductDB
   - Username: postgres
   - Password: postgres

3. **Container'ın çalıştığını kontrol edin**:
   ```bash
   docker-compose ps
   ```

4. **Container'ı durdurmak için**:
   ```bash
   docker-compose down
   ```
   
   **Verileri de silmek için** (dikkatli kullanın):
   ```bash
   docker-compose down -v
   ```

### Backend Kurulumu

1. **.NET SDK'yı yükleyin** (eğer yüklü değilse):
   - [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0) indirin ve yükleyin

2. **Backend dizinine gidin**:
   ```bash
   cd Backend
   ```

3. **Migration'ları oluşturun ve uygulayın**:
   ```bash
   cd ProductAPI
   dotnet ef migrations add InitialCreate --project ../ProductAPI.Infrastructure --startup-project .
   dotnet ef database update --project ../ProductAPI.Infrastructure --startup-project .
   ```

4. **Backend'i çalıştırın**:
   ```bash
   dotnet run --project ProductAPI
   ```
   
   API şu adreste çalışacaktır: `http://localhost:5000`
   Swagger dokümantasyonu: `http://localhost:5000/swagger`

### Frontend Kurulumu

1. **Frontend dizinine gidin**:
   ```bash
   cd Frontend
   ```

2. **Bağımlılıkları yükleyin**:
   ```bash
   npm install
   # veya
   yarn install
   ```

3. **Environment değişkenlerini ayarlayın**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   `.env.local` dosyasını düzenleyin ve backend API URL'ini ayarlayın:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Frontend'i çalıştırın**:
   ```bash
   npm run dev
   # veya
   yarn dev
   ```
   
   Uygulama şu adreste çalışacaktır: `http://localhost:3000`

## API Endpoints

### GET /api/products
Tüm ürünleri listeler.

### GET /api/products/{id}
Belirli bir ürünü getirir.

### POST /api/products
Yeni bir ürün oluşturur.

**Request Body:**
```json
{
  "name": "Ürün Adı",
  "description": "Ürün Açıklaması",
  "price": 99.99
}
```

### PUT /api/products/{id}
Bir ürünü günceller.

### DELETE /api/products/{id}
Bir ürünü siler.

## Mimari

### Backend
- **Controller**: HTTP isteklerini yönetir
- **Service**: İş mantığını içerir
- **Repository**: Veritabanı işlemlerini yönetir
- **DTO**: Veri transfer nesneleri
- **Domain**: Entity modelleri

### Frontend
- **App Router**: Next.js 14+ App Router kullanılmıştır
- **TypeScript**: Tip güvenliği için
- **TailwindCSS**: Stil için

## Teknolojiler

### Backend
- .NET 9
- Entity Framework Core 9
- PostgreSQL (Docker ile)
- Swagger/OpenAPI

### Frontend
- Next.js 14
- TypeScript
- TailwindCSS
- React 18

## Geliştirme Notları

- Backend ve frontend ayrı portlarda çalışır (5000 ve 3000)
- CORS yapılandırması backend'de yapılmıştır
- Tüm CRUD işlemleri async/await kullanılarak yapılmıştır
- SOLID prensipleri uygulanmıştır (Dependency Injection, Single Responsibility)

## Sorun Giderme

### Backend çalışmıyor
- .NET SDK'nın yüklü olduğundan emin olun: `dotnet --version`
- Docker container'ın çalıştığından emin olun: `docker-compose ps`
- PostgreSQL container'ını başlatın: `docker-compose up -d`
- Veritabanı bağlantı string'ini kontrol edin
- Migration'ların uygulandığından emin olun

### Frontend çalışmıyor
- Node.js'in yüklü olduğundan emin olun: `node --version`
- `node_modules` klasörünü silip `npm install` komutunu tekrar çalıştırın
- `.env.local` dosyasının doğru yapılandırıldığından emin olun

### CORS hatası
- Backend'in çalıştığından emin olun
- `Program.cs` dosyasındaki CORS ayarlarını kontrol edin
- Frontend'in doğru API URL'ini kullandığından emin olun

## Lisans

Bu proje eğitim amaçlıdır.

