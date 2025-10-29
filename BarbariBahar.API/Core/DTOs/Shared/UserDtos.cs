namespace BarbariBahar.API.Core.DTOs.Shared
{
    public class CustomerInfoDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Mobile { get; set; } = string.Empty; // Corrected from PhoneNumber
    }
}
