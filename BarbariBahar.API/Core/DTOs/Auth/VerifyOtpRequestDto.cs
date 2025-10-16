using System.ComponentModel.DataAnnotations;


namespace BarbariBahar.API.Core.DTOs.Auth
{
    public class VerifyOtpRequestDto
    {
        [Required]
        [RegularExpression(@"^09\d{9}$")]
        public string phone { get; set; } = default!;

        [Required]
        public string code { get; set; } = default!;

        [Required]
        public int requestId { get; set; }
    }
}
