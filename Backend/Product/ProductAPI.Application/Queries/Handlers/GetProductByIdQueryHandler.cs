using MediatR;
using ProductAPI.Application.DTOs;
using ProductAPI.Application.Interfaces;
using ProductAPI.Application.Queries;

namespace ProductAPI.Application.Queries.Handlers;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto?>
{
    private readonly IProductRepository _repository;
    private readonly ICacheService _cacheService;

    public GetProductByIdQueryHandler(IProductRepository repository, ICacheService cacheService)
    {
        _repository = repository;
        _cacheService = cacheService;
    }

    public async Task<ProductDto?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"product_{request.Id}";

        // Try to get from cache
        var cachedProduct = await _cacheService.GetFromCacheAsync<ProductDto>(cacheKey);
        if (cachedProduct != null)
        {
            return cachedProduct;
        }

        // Get from database
        var product = await _repository.GetByIdAsync(request.Id);
        if (product == null) return null;

        var productDto = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Category = product.Category,
            ImageUrl = product.ImageUrl,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };

        // Cache the result
        await _cacheService.SetCacheAsync(cacheKey, productDto, TimeSpan.FromMinutes(10));

        return productDto;
    }
}

