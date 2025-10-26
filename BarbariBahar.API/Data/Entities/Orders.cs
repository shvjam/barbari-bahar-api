using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BarbariBahar.API.Data.Entities;

namespace BarbariBahar.API.Data.Entities
{
    public class Order
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public string TrackingCode { get; set; }

        [Required]
        public long CustomerId { get; set; }
        [ForeignKey("CustomerId")]
        public virtual Customer Customer { get; set; }

        public long? DriverId { get; set; }
        [ForeignKey("DriverId")]
        public virtual Driver Driver { get; set; }
      [Required]
        public OrderStatus Status { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal FinalPrice { get; set; }
        
        public DateTime? ScheduledAt { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastUpdatedAt { get; set; }

        public virtual ICollection<OrderAddress> OrderAddresses { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; }
        public virtual ICollection<Ticket> Tickets { get; set; }
    }
}
