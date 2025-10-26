using BarbariBahar.API.Core.DTOs.Admin;
using System;
using System.Collections.Generic;

namespace BarbariBahar.API.Core.DTOs.Driver
{
    public class DriverOrderSummaryDto
    {
        public long Id { get; set; }
        public string TrackingCode { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public string OriginAddress { get; set; }
        public string DestinationAddress { get; set; }
    }

    public class DriverOrderDetailDto
    {
        public long Id { get; set; }
        public string TrackingCode { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ScheduledAt { get; set; }

        public CustomerContactDto Customer { get; set; }
        public List<AddressDetailDto> Addresses { get; set; }
        public List<OrderItemDetailDto> Items { get; set; }
    }

    public class CustomerContactDto
    {
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
    }
}
