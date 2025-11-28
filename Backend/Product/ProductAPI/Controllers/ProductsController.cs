using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductAPI.Application.Commands;
using ProductAPI.Application.DTOs;
using ProductAPI.Application.Queries;
using Npgsql;

namespace ProductAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IMediator mediator, ILogger<ProductsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(
        [FromQuery] string? category,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? sortBy)
    {
        try
        {
            var query = new GetAllProductsQuery
            {
                Category = category,
                MinPrice = minPrice,
                MaxPrice = maxPrice,
                SortBy = sortBy
            };

            var products = await _mediator.Send(query);
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ürünler listelenirken hata oluştu");
            
            // Check if it's a database connection or schema error
            if (ex.InnerException is Npgsql.NpgsqlException npgsqlEx)
            {
                if (npgsqlEx.SqlState == "42P01") // relation does not exist
                {
                    return StatusCode(503, new { error = "Veritabanı tablosu bulunamadı. Lütfen veritabanı migration'larının uygulandığından emin olun." });
                }
                return StatusCode(503, new { error = "Veritabanı bağlantısı kurulamadı. Lütfen veritabanı servisinin çalıştığından emin olun." });
            }
            if (ex.Message.Contains("Failed to connect") || ex.Message.Contains("connection") || ex.Message.Contains("does not exist"))
            {
                return StatusCode(503, new { error = "Veritabanı bağlantısı kurulamadı veya tablo bulunamadı." });
            }
            
            return StatusCode(500, new { error = "Bir hata oluştu" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        try
        {
            var query = new GetProductByIdQuery { Id = id };
            var product = await _mediator.Send(query);
            
            if (product == null)
            {
                return NotFound($"Id={id} olan ürün bulunamadı");
            }
            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ürün getirilirken hata oluştu. Id: {Id}", id);
            
            // Check if it's a database connection error
            if (ex.InnerException is Npgsql.NpgsqlException || 
                ex.Message.Contains("Failed to connect") || 
                ex.Message.Contains("connection"))
            {
                return StatusCode(503, new { error = "Veritabanı bağlantısı kurulamadı. Lütfen veritabanı servisinin çalıştığından emin olun." });
            }
            
            return StatusCode(500, new { error = "Bir hata oluştu" });
        }
    }

    [HttpPost]
    [Authorize] // JWT authentication required
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto createProductDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var command = new CreateProductCommand
            {
                Name = createProductDto.Name,
                Description = createProductDto.Description,
                Price = createProductDto.Price,
                Category = createProductDto.Category,
                ImageUrl = createProductDto.ImageUrl
            };

            var product = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ürün oluşturulurken hata oluştu");
            
            // Check if it's a database connection error
            if (ex.InnerException is Npgsql.NpgsqlException || 
                ex.Message.Contains("Failed to connect") || 
                ex.Message.Contains("connection"))
            {
                return StatusCode(503, new { error = "Veritabanı bağlantısı kurulamadı. Lütfen veritabanı servisinin çalıştığından emin olun." });
            }
            
            return StatusCode(500, new { error = "Bir hata oluştu" });
        }
    }

    [HttpPut("{id}")]
    [Authorize] // JWT authentication required
    public async Task<ActionResult<ProductDto>> UpdateProduct(int id, [FromBody] CreateProductDto updateProductDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var command = new UpdateProductCommand
            {
                Id = id,
                Name = updateProductDto.Name,
                Description = updateProductDto.Description,
                Price = updateProductDto.Price,
                Category = updateProductDto.Category,
                ImageUrl = updateProductDto.ImageUrl
            };

            var product = await _mediator.Send(command);
            if (product == null)
            {
                return NotFound($"Id={id} olan ürün bulunamadı");
            }
            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ürün güncellenirken hata oluştu. Id: {Id}", id);
            
            // Check if it's a database connection error
            if (ex.InnerException is Npgsql.NpgsqlException || 
                ex.Message.Contains("Failed to connect") || 
                ex.Message.Contains("connection"))
            {
                return StatusCode(503, new { error = "Veritabanı bağlantısı kurulamadı. Lütfen veritabanı servisinin çalıştığından emin olun." });
            }
            
            return StatusCode(500, new { error = "Bir hata oluştu" });
        }
    }

    [HttpDelete("{id}")]
    [Authorize] // JWT authentication required
    public async Task<ActionResult> DeleteProduct(int id)
    {
        try
        {
            var command = new DeleteProductCommand { Id = id };
            var result = await _mediator.Send(command);
            
            if (!result)
            {
                return NotFound($"Id={id} olan ürün bulunamadı");
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ürün silinirken hata oluştu. Id: {Id}", id);
            
            // Check if it's a database connection error
            if (ex.InnerException is Npgsql.NpgsqlException || 
                ex.Message.Contains("Failed to connect") || 
                ex.Message.Contains("connection"))
            {
                return StatusCode(503, new { error = "Veritabanı bağlantısı kurulamadı. Lütfen veritabanı servisinin çalıştığından emin olun." });
            }
            
            return StatusCode(500, new { error = "Bir hata oluştu" });
        }
    }
}

