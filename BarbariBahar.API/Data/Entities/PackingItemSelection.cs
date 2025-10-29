using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Data.Entities
{
    public class PackingItemSelection
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long OrderId { get; set; }
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; } = null!;

        [Required]
        public int ProductId { get; set; }
        [ForeignKey("ProductId")]
        public virtual PackagingProduct Product { get; set; } = null!;

        [Required]
        public int Quantity { get; set; }
    }
}
