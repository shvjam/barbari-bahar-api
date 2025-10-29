using System.Collections.Generic;

namespace BarbariBahar.API.Core.DTOs.Order
{
    public class CalculatePriceRequestDto
    {
        public AddressDto Origin { get; set; } = null!;
        public AddressDto Destination { get; set; } = null!;
        public List<int> PricingFactorIds { get; set; } = new List<int>();
        public List<OrderItemDto> PackagingProducts { get; set; } = new List<OrderItemDto>();

        // New fields to match the UI
        public int OriginFloor { get; set; }
        public bool OriginElevator { get; set; }
        public int DestFloor { get; set; }
        public bool DestElevator { get; set; }
        public int Workers { get; set; }
        public int WalkDistance { get; set; }
        public List<HeavyItemDto> HeavyItems { get; set; } = new List<HeavyItemDto>();
    }
}
