using System;
using System.Collections.Generic;

namespace BarbariBahar.API.Core.DTOs.Order
{
    // DTO for the list of orders for a customer
    public class CustomerOrderSummaryDto
    {
        public long Id { get; set; }
        public string TrackingCode { get; set; }
        public string Status { get; set; }
        public decimal FinalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // DTO for the detailed view of an order for a customer
    public class CustomerOrderDetailDto
    {
        public long Id { get; set; }
        public string TrackingCode { get; set; }
        public string Status { get; set; }
        public decimal FinalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ScheduledAt { get; set; }

        public List<BarbariBahar.API.Core.DTOs.Admin.AddressDetailDto> Addresses { get; set; }
        public List<BarbariBahar.API.Core.DTOs.Admin.OrderItemDetailDto> Items { get; set; }
    }
}
