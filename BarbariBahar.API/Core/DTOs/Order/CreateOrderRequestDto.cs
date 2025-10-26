using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Core.DTOs.Order
{
    public class CreateOrderRequestDto
    {
        [Required]
        public List<OrderAddressDto> Addresses { get; set; }

        [Required]
        public List<OrderItemDto> Items { get; set; }
    }

    public class OrderAddressDto
    {
        [Required]
        public string FullAddress { get; set; }

        [Required]
        public string AddressType { get; set; } // "Origin" or "Destination"
    }

    public class OrderItemDto
    {
        [Required]
        public int PricingFactorId { get; set; }

        [Required]
        public int Quantity { get; set; }
    }
}
