using System.Collections.Generic;

namespace BarbariBahar.API.Core.DTOs.Order
{
    public class CalculatePriceRequestDto
    {
        public AddressDto Origin { get; set; }
        public AddressDto Destination { get; set; }
        public List<int> PricingFactorIds { get; set; }
        public List<OrderItemDto> PackagingProducts { get; set; }
    }

    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
