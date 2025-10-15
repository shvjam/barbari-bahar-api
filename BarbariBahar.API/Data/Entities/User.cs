using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Data.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Mobile { get; set; } = string.Empty;
        public string? FirstName { get; set; } = string.Empty;// علامت ؟ یعنی این فیلد می‌تواند null باشد
        public string? LastName { get; set; } = string.Empty;  // علامت ؟ یعنی این فیلد می‌تواند null باشد
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

        // --- Foreign Key and Navigation Property ---

        [ForeignKey("Role")] // به EF Core می‌گوید که این پراپرتی کلید خارجی است
        public int RoleId { get; set; }

        // Navigation Property: هر کاربر دقیقاً به یک نقش تعلق دارد
        public virtual Role Role { get; set; } = null!;
    }
}
