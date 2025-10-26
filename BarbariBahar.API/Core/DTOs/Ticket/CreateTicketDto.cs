namespace BarbariBahar.API.Core.DTOs.Ticket
{
    public class CreateTicketDto
    {
        public long? OrderId { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
    }
}
