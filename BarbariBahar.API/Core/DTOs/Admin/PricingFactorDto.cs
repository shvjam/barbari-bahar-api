namespace BarbariBahar.API.Core.DTOs.Admin
{
    public class PricingFactorDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string Unit { get; set; } = string.Empty;
        public int ServiceCategoryId { get; set; }
        public bool IsActive { get; set; }
    }
}
