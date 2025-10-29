using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Core.DTOs.Product
{
    public class CreatePackagingProductDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        public string Description { get; set; } = string.Empty;

        [Required]
        public int CategoryId { get; set; }
    }
}
