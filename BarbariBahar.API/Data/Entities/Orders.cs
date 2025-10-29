using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Data.Entities
{
    public class Order
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public string TrackingCode { get; set; } = string.Empty;

        // CustomerId is now nullable to support guest orders
        public long? CustomerId { get; set; }
        [ForeignKey("CustomerId")]
        public virtual Customer Customer { get; set; } = null!;

        public long? DriverId { get; set; }
        [ForeignKey("DriverId")]
        public virtual Driver Driver { get; set; } = null!;

        [Required]
        public OrderStatus Status { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal FinalPrice { get; set; }
        
        public DateTime? ScheduledAt { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastUpdatedAt { get; set; }

        public virtual ICollection<OrderAddress> OrderAddresses { get; set; } = new List<OrderAddress>();
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
        public virtual ICollection<PackingItemSelection> PackingItems { get; set; } = new List<PackingItemSelection>();
    }
}
