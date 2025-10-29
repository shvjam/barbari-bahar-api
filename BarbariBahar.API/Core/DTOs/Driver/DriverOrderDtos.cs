using BarbariBahar.API.Core.DTOs.Shared;
using System;
using System.Collections.Generic;

namespace BarbariBahar.API.Core.DTOs.Driver
{
    public class DriverOrderSummaryDto
    {
        public long Id { get; set; }
        public string TrackingCode { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? ScheduledAt { get; set; }
        public string OriginAddress { get; set; } = string.Empty;
        public string DestinationAddress { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class DriverOrderDetailDto : DriverOrderSummaryDto
    {
        public decimal FinalPrice { get; set; }
        public CustomerInfoDto Customer { get; set; } = null!;
        public List<AddressDetailDto> Addresses { get; set; } = new List<AddressDetailDto>();
        public List<OrderItemDetailDto> Items { get; set; } = new List<OrderItemDetailDto>();
    }
}
