using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Core.DTOs.Auth
{
    public class LoginDto
    {
        [Required(ErrorMessage = "وارد کردن شماره موبایل الزامی است.")]
        [RegularExpression(@"^09\d{9}$", ErrorMessage = "فرمت شماره موبایل صحیح نیست.")]
        public string Phone { get; set; } = string.Empty;
    }
}
