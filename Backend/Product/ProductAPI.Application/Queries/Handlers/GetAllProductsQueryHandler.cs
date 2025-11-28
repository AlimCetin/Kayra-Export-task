using MediatR;
using ProductAPI.Application.DTOs;
using ProductAPI.Application.Interfaces;
using ProductAPI.Application.Queries;

namespace ProductAPI.Application.Queries.Handlers;

public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, IEnumerable<ProductDto>>
{
    private readonly IProductRepository _repository;
    private readonly ICacheService _cacheService;

    public GetAllProductsQueryHandler(IProductRepository repository, ICacheService cacheService)
    {
        _repository = repository;
        _cacheService = cacheService;
    }

    public async Task<IEnumerable<ProductDto>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
    {
        // Create cache key based on filters
        var cacheKey = $"products_{request.Category}_{request.MinPrice}_{request.MaxPrice}_{request.SortBy}";

        // Try to get from cache
        var cachedProducts = await _cacheService.GetFromCacheAsync<IEnumerable<ProductDto>>(cacheKey);
        if (cachedProducts != null)
        {
            return cachedProducts;
        }

        // Get from database
        var products = await _repository.GetAllAsync();

        // Apply filters
        if (!string.IsNullOrEmpty(request.Category))
        {
            products = products.Where(p => p.Category.Equals(request.Category, StringComparison.OrdinalIgnoreCase));
        }

        if (request.MinPrice.HasValue)
        {
            products = products.Where(p => p.Price >= request.MinPrice.Value);
        }

        if (request.MaxPrice.HasValue)
        {
            products = products.Where(p => p.Price <= request.MaxPrice.Value);
        }

        // Apply sorting
        products = request.SortBy switch
        {
            "price_asc" => products.OrderBy(p => p.Price),
            "price_desc" => products.OrderByDescending(p => p.Price),
            "name_asc" => products.OrderBy(p => p.Name),
            "name_desc" => products.OrderByDescending(p => p.Name),
            _ => products.OrderBy(p => p.Id)
        };

        var productDtos = products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            Category = p.Category,
            ImageUrl = p.ImageUrl,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt
        }).ToList();

        // Cache the result
        await _cacheService.SetCacheAsync(cacheKey, productDtos, TimeSpan.FromMinutes(10));

        return productDtos;
    }
}

