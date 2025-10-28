using System;
using System.Collections.Generic;

namespace BarbariBahar.API.Core.DTOs.Order
{
    public class CreateOrderRequestDto
    {
        public AddressDto Origin { get; set; }
        public AddressDto Destination { get; set; }
        public DateTime? ScheduledAt { get; set; }

        // All fields required for server-side price calculation
        public int OriginFloor { get; set; }
        public bool OriginElevator { get; set; }
        public int DestFloor { get; set; }
        public bool DestElevator { get; set; }
        public int Workers { get; set; }
        public int WalkDistance { get; set; }
        public List<HeavyItemDto> HeavyItems { get; set; }
        public List<int> PricingFactorIds { get; set; }
        public List<OrderItemDto> PackagingProducts { get; set; }
    }

    // Moved from CalculatePriceRequestDto to be shared
    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class HeavyItemDto
    {
        public string ItemId { get; set; }
        public int Quantity { get; set; }
    }
}
