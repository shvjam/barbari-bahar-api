// مسیر: BarbariBahar.API/Core/DTOs/Auth/VerifyLoginOtpDto.cs
using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Core.DTOs.Auth
{
    public class VerifyLoginOtpDto
    {
        [Required]
        [RegularExpression(@"^09\d{9}$")]
        public string Phone { get; set; } = default!; // <<-- تغییر نام

        [Required]
        public string Code { get; set; } = default!; // <<-- تغییر نام

        [Required]
        public int RequestId { get; set; } // <<-- تغییر نام
        public long? GuestOrderId { get; set; }
    }
}
