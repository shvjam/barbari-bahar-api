using System;
using System.Collections.Generic;

namespace BarbariBahar.API.Core.DTOs.Admin
{
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

    public class CustomerInfoDto
    {
        public long Id { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
    }

    public class DriverInfoDto
    {
        public long Id { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string CarModel { get; set; }
        public string CarPlateNumber { get; set; }
    }

    public class AddressDetailDto
    {
        public string Type { get; set; }
        public string FullAddress { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }

    public class OrderItemDetailDto
    {
        public string ItemName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
