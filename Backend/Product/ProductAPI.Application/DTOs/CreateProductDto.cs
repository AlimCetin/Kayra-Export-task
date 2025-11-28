using System.ComponentModel.DataAnnotations;

namespace ProductAPI.Application.DTOs;

public class CreateProductDto
{
    [Required(ErrorMessage = "Ürün adı gereklidir")]
    [StringLength(200, ErrorMessage = "Ürün adı en fazla 200 karakter olabilir")]
    public string Name { get; set; } = string.Empty;

    [StringLength(1000, ErrorMessage = "Açıklama en fazla 1000 karakter olabilir")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Fiyat gereklidir")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Fiyat 0'dan büyük olmalıdır")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Kategori gereklidir")]
    public string Category { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }
}

