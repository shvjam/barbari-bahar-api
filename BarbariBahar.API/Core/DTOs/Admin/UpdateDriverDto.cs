using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Core.DTOs.Admin
{
    public class UpdateDriverDto
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string NationalCode { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public int WorkerCount { get; set; }
        [Required]
        public string CarModel { get; set; }
        [Required]
        public string CarPlateNumber { get; set; }
    }
}
