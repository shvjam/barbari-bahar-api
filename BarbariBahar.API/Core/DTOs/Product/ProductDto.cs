namespace BarbariBahar.API.Core.DTOs.Product
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Unit { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public string? CategoryName { get; set; }
        public string? ImageUrl { get; set; }
    }
}
