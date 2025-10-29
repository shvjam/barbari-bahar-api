// AuthController.cs (with association logic)
using BarbariBahar.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
// ... other usings

public class SendOtpWithGuestDto
{
    public string PhoneNumber { get; set; }
    public long? GuestOrderId { get; set; }
}

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly BarbariBaharDbContext _context;
    // ... constructor

    [HttpPost("send-otp")]
    public async Task<IActionResult> SendOtp([FromBody] SendOtpWithGuestDto dto)
    {
        // ... existing OTP sending logic ...
        // If GuestOrderId is present, maybe store it with the OTP request for later retrieval
        return Ok();
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto dto)
    {
        // ... existing OTP verification logic ...

        // After successful verification and getting the user:
        if (dto.GuestOrderId.HasValue)
        {
            var guestOrder = await _context.Orders.FindAsync(dto.GuestOrderId.Value);
            if (guestOrder != null && guestOrder.CustomerId == null)
            {
                guestOrder.CustomerId = user.Id;
                await _context.SaveChangesAsync();
            }
        }

        // ... generate and return JWT token ...
        return Ok(new { Token = "jwt_token" });
    }
}
