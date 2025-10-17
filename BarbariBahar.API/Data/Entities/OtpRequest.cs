using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // این using را اضافه کن

namespace BarbariBahar.API.Data.Entities
{
    public class OtpRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [RegularExpression(@"^09\d{9}$")]
        public string Mobile { get; set; } = string.Empty;

        public string Code { get; set; } = string.Empty;

        [Required]
        public DateTime CreatedAt { get; set; }

        public DateTime ExpiresAt { get; set; }

        public bool IsUsed { get; set; } = false;

        // --- پراپرتی‌ها را برمی‌گردانیم ---

        // UserId را به صورت int? تعریف می‌کنیم. علامت ؟ یعنی این فیلد می‌تواند NULL باشد.
        public int? UserId { get; set; }

        // پراپرتی ناوبری (Navigation Property)
        // از کلمه کلیدی virtual برای فعال کردن Lazy Loading استفاده می‌کنیم.
        [ForeignKey("UserId")] // به EF Core می‌گوییم که این پراپرتی به UserId مرتبط است.
        public virtual User? User { get; set; }
    }
}