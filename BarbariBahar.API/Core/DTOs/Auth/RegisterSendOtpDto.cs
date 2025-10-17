// مسیر: BarbariBahar.API/Core/DTOs/Auth/RegisterSendOtpDto.cs
using System.ComponentModel.DataAnnotations;


namespace BarbariBahar.API.Core.DTOs.Auth
{
    public class RegisterSendOtpDto
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        public string LastName { get; set; } = string.Empty;
        [Required]
        [RegularExpression(@"^09\d{9}$")]


        public string Phone { get; set; } = string.Empty;
        [Required]
        public string Role { get; set; } = string.Empty; // <<-- این فیلد اضافه شد
    }
}
