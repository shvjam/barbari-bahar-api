using BarbariBahar.API.Core.DTOs.Role;
using BarbariBahar.API.Data;
using BarbariBahar.API.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BarbariBahar.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public RolesController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleDto createRoleDto)
        {
            // 1. بررسی اینکه آیا نقشی با این نام از قبل وجود دارد یا نه
            var roleExists = await _context.Roles.AnyAsync(r => r.Name == createRoleDto.Name);
            if (roleExists)
            {
                return BadRequest("نقشی با این نام از قبل در سیستم ثبت شده است.");
            }

            // 2. ساخت یک نمونه جدید از Entity نقش
            var newRole = new Role
            {
                Name = createRoleDto.Name
            };

            // 3. اضافه کردن نقش جدید به DbContext
            await _context.Roles.AddAsync(newRole);

            // 4. ذخیره تغییرات در دیتابیس
            await _context.SaveChangesAsync();

            // 5. بازگرداندن پاسخ موفقیت آمیز (کد 201 Created)
            // برای رعایت استاندارد REST، معمولا اطلاعات شی ساخته شده را برمی‌گردانیم.
            return CreatedAtAction(nameof(CreateRole), new { id = newRole.Id }, newRole);
        }
    }
}
