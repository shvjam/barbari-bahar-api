using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Core.DTOs.Auth
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "وارد کردن شماره موبایل الزامی است.")]
        [RegularExpression(@"^09\d{9}$", ErrorMessage = "فرمت شماره موبایل صحیح نیست.")]
        public string Mobile { get; set; } = string.Empty;

        [Required(ErrorMessage = "وارد کردن نام الزامی است.")]
        [MaxLength(50, ErrorMessage = "نام نمی‌تواند بیشتر از 50 کاراکتر باشد.")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "وارد کردن نام خانوادگی الزامی است.")]
        [MaxLength(50, ErrorMessage = "نام خانوادگی نمی‌تواند بیشتر از 50 کاراکتر باشد.")]
        public string LastName { get; set; } = string.Empty;
    }
}
