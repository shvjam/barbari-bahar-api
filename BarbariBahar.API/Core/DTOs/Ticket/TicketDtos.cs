using System;
using System.Collections.Generic;

namespace BarbariBahar.API.Core.DTOs.Ticket
{
    public class TicketSummaryDto
    {
        public int Id { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime LastUpdatedAt { get; set; }
    }

    public class TicketDetailDto
    {
        public int Id { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public long? OrderId { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<TicketMessageDto> Messages { get; set; } = new List<TicketMessageDto>();
    }

    public class TicketMessageDto
    {
        public string SenderName { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
    }
}
