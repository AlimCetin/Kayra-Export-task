using MediatR;
using ProductAPI.Application.Commands;
using ProductAPI.Application.DTOs;
using ProductAPI.Application.Interfaces;

namespace ProductAPI.Application.Commands.Handlers;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, ProductDto?>
{
    private readonly IProductRepository _repository;
    private readonly ICacheService _cacheService;

    public UpdateProductCommandHandler(IProductRepository repository, ICacheService cacheService)
    {
        _repository = repository;
        _cacheService = cacheService;
    }

    public async Task<ProductDto?> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var existingProduct = await _repository.GetByIdAsync(request.Id);
        if (existingProduct == null) return null;

        existingProduct.Name = request.Name;
        existingProduct.Description = request.Description;
        existingProduct.Price = request.Price;
        existingProduct.Category = request.Category;
        existingProduct.ImageUrl = request.ImageUrl;
        existingProduct.UpdatedAt = DateTime.UtcNow;

        var updatedProduct = await _repository.UpdateAsync(request.Id, existingProduct);
        if (updatedProduct == null) return null;

        // Invalidate all product-related cache entries
        await _cacheService.InvalidateCacheByPatternAsync("products_*");
        await _cacheService.InvalidateCacheAsync($"product_{request.Id}");

        return new ProductDto
        {
            Id = updatedProduct.Id,
            Name = updatedProduct.Name,
            Description = updatedProduct.Description,
            Price = updatedProduct.Price,
            Category = updatedProduct.Category,
            ImageUrl = updatedProduct.ImageUrl,
            CreatedAt = updatedProduct.CreatedAt,
            UpdatedAt = updatedProduct.UpdatedAt
        };
    }
}

