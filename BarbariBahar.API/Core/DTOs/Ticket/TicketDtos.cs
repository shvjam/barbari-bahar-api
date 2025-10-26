using System;
using System.Collections.Generic;

namespace BarbariBahar.API.Core.DTOs.Ticket
{
    public class TicketSummaryDto
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public string Status { get; set; }
        public DateTime LastUpdatedAt { get; set; }
    }

    public class TicketDetailDto
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public string Status { get; set; }
        public long? OrderId { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<TicketMessageDto> Messages { get; set; }
    }

    public class TicketMessageDto
    {
        public string SenderName { get; set; }
        public string Message { get; set; }
        public DateTime SentAt { get; set; }
    }
}
