using BarbariBahar.API.Core.DTOs.Shared;
using System;
using System.Collections.Generic;

namespace BarbariBahar.API.Core.DTOs.Driver
{
    public class DriverOrderSummaryDto
    {
        public long Id { get; set; }
        public string TrackingCode { get; set; }
        public string Status { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public string OriginAddress { get; set; }
        public string DestinationAddress { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class DriverOrderDetailDto : DriverOrderSummaryDto
    {
        public decimal FinalPrice { get; set; }
        public CustomerInfoDto Customer { get; set; }
        public List<AddressDetailDto> Addresses { get; set; }
        public List<OrderItemDetailDto> Items { get; set; }
    }
}
