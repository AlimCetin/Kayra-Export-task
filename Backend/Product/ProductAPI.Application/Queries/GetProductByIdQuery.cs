using MediatR;
using ProductAPI.Application.DTOs;

namespace ProductAPI.Application.Queries;

public class GetProductByIdQuery : IRequest<ProductDto?>
{
    public int Id { get; set; }
}

