namespace BarbariBahar.API.Core.DTOs.Auth
{
    public class TokenDto
    {
        public string token { get; set; } = string.Empty; // تغییر به حروف کوچک
        public DateTime expiration { get; set; } // تغییر به حروف کوچک
    }
}
