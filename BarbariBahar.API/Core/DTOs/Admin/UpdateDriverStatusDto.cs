using BarbariBahar.API.Data.Enums;
using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Core.DTOs.Admin
{
    public class UpdateDriverStatusDto
    {
        [Required]
        public DriverStatus Status { get; set; }
    }
}
