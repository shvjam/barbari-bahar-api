// مسیر: BarbariBahar.API/Core/DTOs/Auth/VerifyRegisterOtpDto.cs
using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Core.DTOs.Auth
{
    public class VerifyRegisterOtpDto
    {
        // اطلاعات پایه
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        [Required]
        [RegularExpression(@"^09\d{9}$")]
        public string Phone { get; set; } = string.Empty;
        [Required]
        public string Role { get; set; } // "Customer" or "Driver"

        // اطلاعات تایید OTP
        [Required]
        public string Code { get; set; } = string.Empty;
        [Required]
        public int RequestId { get; set; }

        // اطلاعات اختصاصی راننده (اختیاری)
        public string? NationalCode { get; set; }
        public string? CarModel { get; set; }
        public string? CarPlateNumber { get; set; }
    }
}
