using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Data.Entities
{
    public class DriverLocation
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long DriverId { get; set; }

        [ForeignKey("DriverId")]
        public virtual Driver Driver { get; set; }

        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
