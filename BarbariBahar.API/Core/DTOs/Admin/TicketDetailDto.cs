using System;
using System.Collections.Generic;

namespace BarbariBahar.API.Core.DTOs.Admin
{
    public class TicketDetailDto
    {
        public long Id { get; set; }
        public string Subject { get; set; }
        public string UserName { get; set; }
        public string Status { get; set; }
        public string Priority { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<TicketMessageDto> Messages { get; set; }
    }

    public class TicketMessageDto
    {
        public long Id { get; set; }
        public string SenderName { get; set; }
        public string Message { get; set; }
        public DateTime SentAt { get; set; }
        public bool IsFromAdmin { get; set; }
    }
}
