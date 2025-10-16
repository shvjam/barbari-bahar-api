using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Data.Entities
{
    public class OtpRequest 
    {
        [Key]
        public int Id { get; set; }

        public string Code { get; set; } = string.Empty;

        [Required]
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }

        public bool IsUsed { get; set; } = false;

        // --- Foreign Key and Navigation Property ---
        [ForeignKey("User")]
        public int UserId { get; set; } // <--- باید از نوع int باشد تا با User.Id هماهنگ شود

        public virtual User User { get; set; } = null!;
    }
}
