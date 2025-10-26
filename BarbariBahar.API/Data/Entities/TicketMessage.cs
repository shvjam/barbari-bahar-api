using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Data.Entities
{
    public class TicketMessage
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long TicketId { get; set; }
        [ForeignKey("TicketId")]
        public virtual Ticket Ticket { get; set; }

        [Required]
        public long SenderId { get; set; }
        [ForeignKey("SenderId")]
        public virtual User Sender { get; set; }

        [Required]
        public string Message { get; set; }

        [Required]
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
