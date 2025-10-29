namespace BarbariBahar.API.Core.DTOs.Guest
{
    public class UpdateGuestOrderDto
    {
        // Define properties that can be updated on a guest order.
        // This will likely include details from the quote flow.
        public decimal FinalPrice { get; set; }
        public System.Collections.Generic.List<BarbariBahar.API.Core.DTOs.Order.OrderItemDto> PackagingProducts { get; set; } = new System.Collections.Generic.List<BarbariBahar.API.Core.DTOs.Order.OrderItemDto>();
    }
}
