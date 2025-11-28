using Microsoft.EntityFrameworkCore;
using AuthAPI.Application.Interfaces;
using AuthAPI.Application.Services;
using AuthAPI.Infrastructure.Data;
using AuthAPI.Infrastructure.Repositories;
using AuthAPI.Middleware;
using DotNetEnv;
using Serilog;

// Load .env file
Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/authapi-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database Configuration - PostgreSQL (AuthDB)
var connectionString = Environment.GetEnvironmentVariable("AUTH_DATABASE_CONNECTION_STRING") 
    ?? builder.Configuration.GetConnectionString("AuthConnection");

if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'AUTH_DATABASE_CONNECTION_STRING' not found.");
}

builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorCodesToAdd: null);
    }));

// Dependency Injection
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

// CORS Configuration
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

app.UseAuthorization();

app.MapControllers();

// Verify database connection on startup
try
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var dbContext = services.GetRequiredService<AuthDbContext>();
        var logger = services.GetRequiredService<ILogger<Program>>();
        
        logger.LogInformation("Verifying database connection...");
        var canConnect = await dbContext.Database.CanConnectAsync();
        if (canConnect)
        {
            logger.LogInformation("Database connection successful!");
            
            // Ensure database is created
            await dbContext.Database.EnsureCreatedAsync();
            logger.LogInformation("Database schema verified/created.");
        }
        else
        {
            logger.LogWarning("Database connection check returned false.");
        }
    }
}
catch (Exception ex)
{
    Log.Error(ex, "CRITICAL: Failed to connect to database. Please ensure PostgreSQL is running on port 5433.");
    Log.Error("Connection string: {ConnectionString}", 
        connectionString.Replace("Password=postgres", "Password=***"));
    throw;
}

Log.Information("AuthAPI starting on port 5001");

await app.RunAsync();

