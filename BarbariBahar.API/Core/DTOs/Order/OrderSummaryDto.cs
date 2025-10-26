using System;

namespace BarbariBahar.API.Core.DTOs.Order
{
    public class OrderSummaryDto
    {
        public long Id { get; set; }
        public string TrackingCode { get; set; }
        public string CustomerName { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal FinalPrice { get; set; }
        public string OriginAddress { get; set; }
        public string DestinationAddress { get; set; }
    }
}
