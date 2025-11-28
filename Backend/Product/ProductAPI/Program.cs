using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ProductAPI.Application.Interfaces;
using ProductAPI.Application.Services;
using ProductAPI.Infrastructure.Data;
using ProductAPI.Infrastructure.Repositories;
using ProductAPI.Infrastructure.Services;
using ProductAPI.Middleware;
using DotNetEnv;
using Serilog;
using StackExchange.Redis;
using System.Reflection;
using System.Text;

// Load .env file (12 Factor App - Config principle)
Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/productapi-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database Configuration - PostgreSQL (ProductDB)
// 12 Factor App: Configuration from environment variables
var connectionString = Environment.GetEnvironmentVariable("PRODUCT_DATABASE_CONNECTION_STRING") 
    ?? builder.Configuration.GetConnectionString("ProductConnection");

if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'PRODUCT_DATABASE_CONNECTION_STRING' not found in environment variables or appsettings.json.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorCodesToAdd: null);
    }));

// Redis Configuration
var redisConnectionString = Environment.GetEnvironmentVariable("REDIS_CONNECTION_STRING")
    ?? builder.Configuration.GetConnectionString("Redis") 
    ?? "localhost:6379";

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(redisConnectionString));

// Dependency Injection
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICacheService, RedisCacheService>();

// MediatR Configuration
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ProductAPI.Application.Commands.CreateProductCommand).Assembly));

// JWT Authentication Configuration
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "AuthAPI";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "AuthAPI";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// CORS Configuration - 12 Factor App: Configuration from environment variables
var allowedOrigins = Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS") 
    ?? "http://localhost:3000,http://localhost:3001";
var origins = allowedOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(origins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Global exception handling middleware - must be early in pipeline
app.UseGlobalExceptionHandler();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Verify database connection and apply migrations on startup
try
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var dbContext = services.GetRequiredService<ApplicationDbContext>();
        var logger = services.GetRequiredService<ILogger<Program>>();
        
        logger.LogInformation("Verifying database connection...");
        var canConnect = await dbContext.Database.CanConnectAsync();
        if (canConnect)
        {
            logger.LogInformation("Database connection successful!");
            
            // Apply pending migrations
            logger.LogInformation("Applying database migrations...");
            await dbContext.Database.MigrateAsync();
            logger.LogInformation("Database migrations applied successfully.");
        }
        else
        {
            logger.LogWarning("Database connection check returned false.");
        }
    }
}
catch (Exception ex)
{
    Log.Error(ex, "CRITICAL: Failed to connect to database or apply migrations. Please ensure PostgreSQL is running on port 5432.");
    Log.Error("Connection string: {ConnectionString}", 
        connectionString.Replace("Password=postgres", "Password=***"));
    throw;
}

Log.Information("ProductAPI starting on port 5000");

await app.RunAsync();

