using System;

namespace BarbariBahar.API.Core.DTOs.Admin
{
    public class OrderSummaryDto
    {
        public long Id { get; set; }
        public string TrackingCode { get; set; }
        public string CustomerName { get; set; }
        public string Status { get; set; }
        public decimal FinalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
