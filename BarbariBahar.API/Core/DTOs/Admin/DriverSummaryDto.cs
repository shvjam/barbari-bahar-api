using BarbariBahar.API.Data.Enums;

namespace BarbariBahar.API.Core.DTOs.Admin
{
    public class DriverSummaryDto
    {
        public long Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Mobile { get; set; } = string.Empty;
        public string CarModel { get; set; } = string.Empty;
        public string CarPlateNumber { get; set; } = string.Empty;
        public DriverStatus Status { get; set; }
    }
}
