namespace BarbariBahar.API.Core.DTOs.Auth
{
    public class TokenDto
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
    }
}
