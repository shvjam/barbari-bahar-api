using BarbariBahar.API.Data.Entities;

namespace BarbariBahar.API.Core.Dtos.PricingFactor // مطمئن شو namespace با پروژه تو مطابقت دارد
{
    public class PricingFactorDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Unit { get; set; }
        public PricingFactorCategory Category { get; set; } // <--- از string به enum تغییر کرد
        public bool IsActive { get; set; }
    }
}
