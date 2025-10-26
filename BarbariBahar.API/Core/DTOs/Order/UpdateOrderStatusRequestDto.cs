using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Core.DTOs.Order
{
    public class UpdateOrderStatusRequestDto
    {
        [Required]
        public string Status { get; set; }
    }
}
