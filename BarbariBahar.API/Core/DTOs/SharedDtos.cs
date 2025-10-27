namespace BarbariBahar.API.Core.DTOs
{
    public class DriverInfoDto
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mobile { get; set; }
        public string CarModel { get; set; }
        public string CarPlateNumber { get; set; }
        public string FullName => $"{FirstName} {LastName}";
        public string PhoneNumber => Mobile;
    }
}
