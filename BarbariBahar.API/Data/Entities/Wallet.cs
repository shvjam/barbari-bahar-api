using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Data.Entities
{
    public class Wallet
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Balance { get; set; }

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }
}
