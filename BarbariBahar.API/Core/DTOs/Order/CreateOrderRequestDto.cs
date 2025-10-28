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
        public DateTime? ScheduledAt { get; set; }

        // New fields to match the UI and ensure server-side price calculation
        public int OriginFloor { get; set; }
        public bool OriginElevator { get; set; }
        public int DestFloor { get; set; }
        public bool DestElevator { get; set; }
        public int Workers { get; set; }
        public int WalkDistance { get; set; }
        public List<HeavyItemDto> HeavyItems { get; set; }
    }
}
