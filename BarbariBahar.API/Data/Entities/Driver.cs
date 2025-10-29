using BarbariBahar.API.Data.Enums;

﻿namespace BarbariBahar.API.Data.Entities
{
    public class Driver : User
    {
        public Driver()
        {
            Role = Role.Driver;
        }
        // ویژگی‌های اختصاصی راننده
        public string NationalCode { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
        public int WorkerCount { get; set; }
        public string CarModel { get; set; } = string.Empty;
        public string CarPlateNumber { get; set; } = string.Empty;
        public DriverStatus Status { get; set; }
        public virtual System.Collections.Generic.ICollection<Order> Orders { get; set; } = new System.Collections.Generic.List<Order>();
    }
}