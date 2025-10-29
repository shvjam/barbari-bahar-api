using System.Collections.Generic;

namespace BarbariBahar.API.Data.Entities
{
    public class ServiceCategory
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        // Navigation property: A service category can have many pricing factors
        public virtual ICollection<PricingFactor> PricingFactors { get; set; } = new List<PricingFactor>();
    }
}
