namespace ProductAPI.Application.Interfaces;

public interface ICacheService
{
    Task<T?> GetFromCacheAsync<T>(string key) where T : class;
    Task SetCacheAsync<T>(string key, T value, TimeSpan expiration) where T : class;
    Task InvalidateCacheAsync(string key);
    Task InvalidateCacheByPatternAsync(string pattern);
}

