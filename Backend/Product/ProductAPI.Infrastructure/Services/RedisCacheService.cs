using System.Text;
using Newtonsoft.Json;
using ProductAPI.Application.Interfaces;
using StackExchange.Redis;

namespace ProductAPI.Infrastructure.Services;

public class RedisCacheService : ICacheService
{
    private readonly IDatabase _database;
    private readonly IConnectionMultiplexer _connectionMultiplexer;

    public RedisCacheService(IConnectionMultiplexer connectionMultiplexer)
    {
        _connectionMultiplexer = connectionMultiplexer;
        _database = connectionMultiplexer.GetDatabase();
    }

    public async Task<T?> GetFromCacheAsync<T>(string key) where T : class
    {
        try
        {
            var cachedValue = await _database.StringGetAsync(key);
            if (!cachedValue.HasValue)
            {
                return null;
            }

            var json = cachedValue.ToString();
            return JsonConvert.DeserializeObject<T>(json);
        }
        catch (Exception)
        {
            // If Redis is unavailable, return null (graceful degradation)
            return null;
        }
    }

    public async Task SetCacheAsync<T>(string key, T value, TimeSpan expiration) where T : class
    {
        try
        {
            var json = JsonConvert.SerializeObject(value);
            await _database.StringSetAsync(key, json, expiration);
        }
        catch (Exception)
        {
            // If Redis is unavailable, silently fail (graceful degradation)
        }
    }

    public async Task InvalidateCacheAsync(string key)
    {
        try
        {
            await _database.KeyDeleteAsync(key);
        }
        catch (Exception)
        {
            // If Redis is unavailable, silently fail
        }
    }

    public async Task InvalidateCacheByPatternAsync(string pattern)
    {
        try
        {
            var server = _connectionMultiplexer.GetServer(_connectionMultiplexer.GetEndPoints().First());
            var keys = server.Keys(pattern: pattern);
            
            foreach (var key in keys)
            {
                await _database.KeyDeleteAsync(key);
            }
        }
        catch (Exception)
        {
            // If Redis is unavailable, silently fail
        }
    }
}

