using BarbariBahar.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;  // این رو به بالای فایل اضافه کن
using Microsoft.EntityFrameworkCore; // این رو هم اضافه کن
using BarbariBahar.API.Core.DTOs.User; // و این رو هم اضافه کن

namespace BarbariBahar.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public UsersController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        // متدهای مربوط به کاربر اینجا اضافه خواهند شد
        [HttpGet("Me")]
        [Authorize] // <--- از همین ابتدا آن را امن می‌کنیم
        public async Task<IActionResult> GetMyProfile()
        {
            // 1. پیدا کردن ID کاربر از توکن (Claim)
            // User.FindFirst(ClaimTypes.NameIdentifier) به ما Claim مربوط به ID کاربر را می‌دهد.
            // .Value مقدار آن را به صورت رشته‌ای برمی‌گرداند.
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                // این اتفاق معمولاً نمی‌افتد اگر توکن معتبر باشد، اما بررسی آن کار خوبی است.
                return Unauthorized(new { Message = "توکن نامعتبر است." });
            }

            // تبدیل ID از رشته به عدد
            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return BadRequest(new { Message = "فرمت ID کاربر در توکن صحیح نیست." });
            }

            // 2. پیدا کردن کاربر در دیتابیس به همراه نقش او
            // از Include برای "Lazy Loading" استفاده می‌کنیم تا اطلاعات نقش هم همراه با کاربر لود شود.
            var user = await _context.Users
                                     .Include(u => u.Role) // <-- این خط، جدول Roles را به کوئری ما join می‌کند
                                     .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound(new { Message = "کاربر یافت نشد." });
            }

            // 3. تبدیل مدل کاربر به DTO برای ارسال به کلاینت
            var profileDto = new ProfileDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Mobile = user.Mobile,
                RoleName = user.Role.Name, // چون Role را Include کردیم، به آن دسترسی داریم
                CreatedAt = user.CreatedAt
            };

            // 4. بازگرداندن DTO به عنوان پاسخ
            return Ok(profileDto);
        }
    }
}
