using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Data.Entities
{
    public class OrderAddress
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long OrderId { get; set; }
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; }

        [Required]
        public AddressType Type { get; set; }

        [Required]
        public string FullAddress { get; set; }

        [Required]
        public double Latitude { get; set; } // Changed to non-nullable

        [Required]
        public double Longitude { get; set; } // Changed to non-nullable
    }

    public enum AddressType
    {
        Origin,
        Destination
    }
}
