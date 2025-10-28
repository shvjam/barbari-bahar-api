namespace BarbariBahar.API.Core.DTOs.Shared
{
    public class AddressDetailDto
    {
        public string Type { get; set; }
        public string FullAddress { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class OrderItemDetailDto
    {
        public string ItemName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
