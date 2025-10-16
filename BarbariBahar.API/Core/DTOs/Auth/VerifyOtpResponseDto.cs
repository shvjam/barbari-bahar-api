using BarbariBahar.API.Core.DTOs.User; // این using برای دسترسی به UserDto ضروری است

namespace BarbariBahar.API.Core.DTOs.Auth
{
    public class VerifyOtpResponseDto
    {
        public string Message { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = default!; // از UserDto سبک که الان ساختیم استفاده می‌کنیم
    }
}
