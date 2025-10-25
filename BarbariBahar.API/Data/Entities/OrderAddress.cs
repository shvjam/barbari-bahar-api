using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Data.Entities
{
    public enum AddressType
    {
        Origin,
        Destination,
        Stop
    }

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

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

public int? Floor { get; set; }
        
        public bool HasElevator { get; set; }
    }
}
