namespace BarbariBahar.API.Core.DTOs.Order
{
    public class AddressDto
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string FullAddress { get; set; } = string.Empty;
    }
}
