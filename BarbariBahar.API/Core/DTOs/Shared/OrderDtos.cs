namespace BarbariBahar.API.Core.DTOs.Shared
{
    public class AddressDetailDto
    {
        public string Type { get; set; } = string.Empty;
        public string FullAddress { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class OrderItemDetailDto
    {
        public string ItemName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
