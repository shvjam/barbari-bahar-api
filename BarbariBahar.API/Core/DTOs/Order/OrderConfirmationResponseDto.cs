namespace BarbariBahar.API.Core.DTOs.Order
{
    public class OrderConfirmationResponseDto
    {
        public long OrderId { get; set; }
        public string TrackingCode { get; set; } = string.Empty;
    }
}
