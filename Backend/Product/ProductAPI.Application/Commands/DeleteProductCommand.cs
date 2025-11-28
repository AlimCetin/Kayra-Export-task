using MediatR;

namespace ProductAPI.Application.Commands;

public class DeleteProductCommand : IRequest<bool>
{
    public int Id { get; set; }
}

