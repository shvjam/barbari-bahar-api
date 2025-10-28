using BarbariBahar.API.Core.DTOs.Shared;
using System;
using System.Collections.Generic;

namespace BarbariBahar.API.Core.DTOs.Order
{
    public class CustomerOrderSummaryDto
    {
        public long Id { get; set; }
        public string TrackingCode { get; set; }
        public string Status { get; set; }
        public decimal FinalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CustomerOrderDetailDto : CustomerOrderSummaryDto
    {
        public DateTime? ScheduledAt { get; set; }
        public DriverInfoDto DriverInfo { get; set; }
        public List<AddressDetailDto> Addresses { get; set; }
        public List<OrderItemDetailDto> Items { get; set; }
    }
}
