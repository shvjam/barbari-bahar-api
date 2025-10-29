namespace BarbariBahar.API.Core.DTOs.Ticket
{
    public class CreateTicketDto
    {
        public long? OrderId { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
