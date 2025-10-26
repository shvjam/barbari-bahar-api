using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Core.DTOs.Order
{
    public class AssignDriverRequestDto
    {
        [Required]
        public long DriverId { get; set; }
    }
}
