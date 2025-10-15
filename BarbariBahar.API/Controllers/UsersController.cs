using BarbariBahar.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
            // فعلاً فقط یک پیام موفقیت برمی‌گردانیم تا کارکرد [Authorize] را تست کنیم.
            // در مرحله بعد، اطلاعات واقعی کاربر را از توکن می‌خوانیم و برمی‌گردانیم.
            return Ok(new { Message = "شما با موفقیت به این API امن دسترسی پیدا کردید." });
        }
    }
}
