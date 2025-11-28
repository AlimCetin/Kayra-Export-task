using MediatR;
using ProductAPI.Application.Commands;
using ProductAPI.Application.Interfaces;

namespace ProductAPI.Application.Commands.Handlers;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, bool>
{
    private readonly IProductRepository _repository;
    private readonly ICacheService _cacheService;

    public DeleteProductCommandHandler(IProductRepository repository, ICacheService cacheService)
    {
        _repository = repository;
        _cacheService = cacheService;
    }

    public async Task<bool> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var result = await _repository.DeleteAsync(request.Id);
        
        if (result)
        {
            // Invalidate all product-related cache entries
            await _cacheService.InvalidateCacheByPatternAsync("products_*");
            await _cacheService.InvalidateCacheAsync($"product_{request.Id}");
        }

        return result;
    }
}

