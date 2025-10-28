using BarbariBahar.API.Core.DTOs.Shared;
using System;
using System.Collections.Generic;

namespace BarbariBahar.API.Core.DTOs.Order
{
    // This DTO might be redundant and can be removed in a future refactoring
    public class OrderDetailDto
    {
        public long Id { get; set; }
        public string TrackingCode { get; set; }
        public string Status { get; set; }
        public decimal FinalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public CustomerInfoDto Customer { get; set; }
        public DriverInfoDto Driver { get; set; }
        public List<AddressDetailDto> Addresses { get; set; }
        public List<OrderItemDetailDto> Items { get; set; }
    }
}
