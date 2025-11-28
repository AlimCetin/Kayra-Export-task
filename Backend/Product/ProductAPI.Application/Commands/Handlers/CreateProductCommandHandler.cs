using MediatR;
using ProductAPI.Application.Commands;
using ProductAPI.Application.DTOs;
using ProductAPI.Application.Interfaces;
using ProductAPI.Domain;

namespace ProductAPI.Application.Commands.Handlers;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ProductDto>
{
    private readonly IProductRepository _repository;
    private readonly ICacheService _cacheService;

    public CreateProductCommandHandler(IProductRepository repository, ICacheService cacheService)
    {
        _repository = repository;
        _cacheService = cacheService;
    }

    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Category = request.Category,
            ImageUrl = request.ImageUrl,
            CreatedAt = DateTime.UtcNow
        };

        var createdProduct = await _repository.CreateAsync(product);

        // Invalidate all product-related cache entries
        await _cacheService.InvalidateCacheByPatternAsync("products_*");

        return new ProductDto
        {
            Id = createdProduct.Id,
            Name = createdProduct.Name,
            Description = createdProduct.Description,
            Price = createdProduct.Price,
            Category = createdProduct.Category,
            ImageUrl = createdProduct.ImageUrl,
            CreatedAt = createdProduct.CreatedAt,
            UpdatedAt = createdProduct.UpdatedAt
        };
    }
}

