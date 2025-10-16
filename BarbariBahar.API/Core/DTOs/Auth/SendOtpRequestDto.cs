using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Core.DTOs.Auth
{
    public class SendOtpRequestDto
    {
        [Required(ErrorMessage = "فیلد موبایل الزامی است.")]
        // Regex را برای فرمت "09" و 9 رقم بعد از آن تغییر می‌دهیم.
        [RegularExpression(@"^09\d{9}$", ErrorMessage = "فرمت شماره موبایل باید به صورت 09... باشد.")]
        public string phone { get; set; } = string.Empty;
    }
}
