using BarbariBahar.API.Data.Enums;

namespace BarbariBahar.API.Core.DTOs.Admin
{
    public class DriverDetailsDto
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mobile { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public string NationalCode { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public int WorkerCount { get; set; }
        public string CarModel { get; set; }
        public string CarPlateNumber { get; set; }
        public DriverStatus Status { get; set; }
    }
}
