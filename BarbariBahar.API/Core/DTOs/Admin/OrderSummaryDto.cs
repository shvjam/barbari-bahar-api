using System;

namespace BarbariBahar.API.Core.DTOs.Admin
{
    public class OrderSummaryDto
    {
        public long Id { get; set; }
        public string TrackingCode { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal FinalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
