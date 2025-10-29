using BarbariBahar.API.Core.DTOs.Shared;
using System;
using System.Collections.Generic;

namespace BarbariBahar.API.Core.DTOs.Admin
{
    public class OrderDetailDto
    {
        public long Id { get; set; }
        public string TrackingCode { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal FinalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public CustomerInfoDto Customer { get; set; } = null!;
        public DriverInfoDto Driver { get; set; } = null!;
        public List<AddressDetailDto> Addresses { get; set; } = new List<AddressDetailDto>();
        public List<OrderItemDetailDto> Items { get; set; } = new List<OrderItemDetailDto>();
    }
}
