namespace BarbariBahar.API.Core.DTOs.Admin
{
    public class PackagingProductDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? Dimensions { get; set; }
        public int Stock { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }
        public bool IsAvailable { get; set; }
        public int CategoryId { get; set; }
    }
}
