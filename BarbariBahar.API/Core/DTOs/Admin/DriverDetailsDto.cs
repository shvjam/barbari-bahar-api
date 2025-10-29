using BarbariBahar.API.Data.Enums;

namespace BarbariBahar.API.Core.DTOs.Admin
{
    public class DriverDetailsDto
    {
        public long Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Mobile { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public string NationalCode { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
        public int WorkerCount { get; set; }
        public string CarModel { get; set; } = string.Empty;
        public string CarPlateNumber { get; set; } = string.Empty;
        public DriverStatus Status { get; set; }
    }
}
