using System;
using System.Collections.Generic;

namespace BarbariBahar.API.Core.DTOs.Order
{
    public class OrderDetailDto
    {
        public long Id { get; set; }
        public string TrackingCode { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal FinalPrice { get; set; }

        public CustomerInfoDto Customer { get; set; }
        public DriverInfoDto Driver { get; set; }

        public List<OrderAddressDetailDto> Addresses { get; set; }
        public List<OrderItemDetailDto> Items { get; set; }
    }

    public class CustomerInfoDto
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mobile { get; set; }
    }

    public class DriverInfoDto
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mobile { get; set; }
        public string CarModel { get; set; }
        public string CarPlateNumber { get; set; }
    }

    public class OrderAddressDetailDto
    {
        public string FullAddress { get; set; }
        public string Type { get; set; }
    }

    public class OrderItemDetailDto
    {
        public string ItemName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
