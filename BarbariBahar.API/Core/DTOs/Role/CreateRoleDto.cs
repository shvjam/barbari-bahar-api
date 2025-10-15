using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Core.DTOs.Role
{
    public class CreateRoleDto
    {
        [Required(ErrorMessage = "نام نقش نمی‌تواند خالی باشد.")]
        [MaxLength(50, ErrorMessage = "نام نقش نمی‌تواند بیشتر از 50 کاراکتر باشد.")]
        public string Name { get; set; } = null!;
    }
}
