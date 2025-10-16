namespace BarbariBahar.API.Core.DTOs.Auth
{
    public class SendOtpResponseDto
    {
        public string Message { get; set; } = string.Empty;
        public int RequestId { get; set; } // <--- از string به int تغییر کرد
    }
}
