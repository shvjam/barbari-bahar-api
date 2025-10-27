namespace BarbariBahar.API.Core.DTOs.Admin
{
    public class TicketSummaryDto
    {
        public long Id { get; set; }
        public string Subject { get; set; }
        public string UserName { get; set; }
        public string Status { get; set; }
        public string Priority { get; set; }
        public DateTime LastUpdate { get; set; }
    }
}
