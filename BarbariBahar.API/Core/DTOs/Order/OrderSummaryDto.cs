using System;

namespace BarbariBahar.API.Core.DTOs.Order
{
    public class OrderSummaryDto
    {
        public long Id { get; set; }
        public string TrackingCode { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public decimal FinalPrice { get; set; }
        public string OriginAddress { get; set; } = string.Empty;
        public string DestinationAddress { get; set; } = string.Empty;
    }
}
