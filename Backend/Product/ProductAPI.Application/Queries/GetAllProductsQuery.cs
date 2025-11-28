using MediatR;
using ProductAPI.Application.DTOs;

namespace ProductAPI.Application.Queries;

public class GetAllProductsQuery : IRequest<IEnumerable<ProductDto>>
{
    public string? Category { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? SortBy { get; set; } // "price_asc", "price_desc", "name_asc", "name_desc"
}

