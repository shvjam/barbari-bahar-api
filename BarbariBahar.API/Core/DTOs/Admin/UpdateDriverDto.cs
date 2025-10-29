using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Core.DTOs.Admin
{
    public class UpdateDriverDto
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        public string LastName { get; set; } = string.Empty;
        [Required]
        public string NationalCode { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
        public int WorkerCount { get; set; }
        [Required]
        public string CarModel { get; set; } = string.Empty;
        [Required]
        public string CarPlateNumber { get; set; } = string.Empty;
    }
}
