namespace BarbariBahar.API.Core.DTOs.PricingFactor // مطمئن شو namespace با پروژه تو مطابقت دارد
{
    public class PricingFactorDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Unit { get; set; } = string.Empty;
        public int ServiceCategoryId { get; set; }
        public string ServiceCategoryName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
