using BarbariBahar.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using BarbariBahar.API.Core.DTOs.User;
using BarbariBahar.API.Data.Entities; // اضافه کردن این using برای دسترسی به Admin, Driver, Customer

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

        [HttpGet("Me")]
        [Authorize] // این endpoint امن است و نیاز به توکن دارد
        public async Task<IActionResult> GetMyProfile()
        {
            // مرحله ۱: پیدا کردن ID کاربر از توکن (Claim)
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized(new { Message = "توکن نامعتبر یا فاقد ID کاربر است." });
            }

            // مرحله ۲: پیدا کردن کاربر در دیتابیس
            // دیگر نیازی به Include(u => u.Role) نداریم
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound(new { Message = "کاربر یافت نشد." });
            }

            // مرحله ۳: تشخیص نقش کاربر بر اساس نوع آن
            string roleName;
            if (user is Admin)
            {
                roleName = "Admin";
            }
            else if (user is Driver)
            {
                roleName = "Driver";
            }
            else // if (user is Customer)
            {
                roleName = "Customer";
            }

            // مرحله ۴: تبدیل مدل کاربر به DTO برای ارسال به کلاینت
            var profileDto = new ProfileDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Mobile = user.Mobile,
                RoleName = roleName, // <<--- استفاده از نقشی که تشخیص دادیم
                CreatedAt = user.CreatedAt
            };

            // مرحله ۵: بازگرداندن DTO به عنوان پاسخ
            return Ok(profileDto);
        }
    }
}
