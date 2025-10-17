// مسیر: BarbariBahar.API/Core/DTOs/Auth/SendOtpRequestDto.cs
using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Core.DTOs.Auth
{
    public class SendOtpRequestDto
    {
        [Required(ErrorMessage = "فیلد موبایل الزامی است.")]
        [RegularExpression(@"^09\d{9}$", ErrorMessage = "فرمت شماره موبایل باید به صورت 09... باشد.")]
        public string Phone { get; set; } = string.Empty; // <<-- از phone به Mobile تغییر کرد
    }
}
