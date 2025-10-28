using System;
using System.Collections.Generic;

namespace BarbariBahar.API.Core.DTOs.Order
{
    public class CreateOrderRequestDto
    {
        public AddressDto Origin { get; set; }
        public AddressDto Destination { get; set; }
        public List<int> PricingFactorIds { get; set; }
        public List<OrderItemDto> PackagingProducts { get; set; }
        public decimal FinalPrice { get; set; }
        public DateTime? ScheduledAt { get; set; }
    }
}
