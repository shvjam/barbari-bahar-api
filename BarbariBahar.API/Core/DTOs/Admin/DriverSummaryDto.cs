using BarbariBahar.API.Data.Enums;

namespace BarbariBahar.API.Core.DTOs.Admin
{
    public class DriverSummaryDto
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mobile { get; set; }
        public string CarModel { get; set; }
        public string CarPlateNumber { get; set; }
        public DriverStatus Status { get; set; }
    }
}
