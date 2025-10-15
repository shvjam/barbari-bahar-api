using BarbariBahar.API.Core.DTOs.Auth;
using BarbariBahar.API.Data;             // مسیر صحیح DbContext
using BarbariBahar.API.Data.Entities;
using BarbariBahar.Core.DTOs.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration; // IConfiguration
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BarbariBahar.API.DTOs;
using System.Threading.Tasks;             // Task


namespace BarbariBahar.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(BarbariBaharDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // متدهای API اینجا اضافه خواهند شد

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            // 1. بررسی اینکه آیا کاربری با این موبایل وجود دارد یا خیر
            var userExists = await _context.Users.AnyAsync(u => u.Mobile == registerDto.Mobile);
            if (userExists)
            {
                return BadRequest(new { Message = "کاربری با این شماره موبایل قبلاً ثبت‌نام کرده است." });
            }

            // 2. پیدا کردن نقش "Customer"
            var customerRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Customer");
            if (customerRole == null)
            {
                // این یک خطای سیستمی است. در حالت عادی نباید رخ دهد چون ما نقش‌ها را از قبل ساختیم
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "نقش پیش‌فرض مشتری در سیستم یافت نشد." });
            }

            // 3. ایجاد یک نمونه جدید از کاربر
            var newUser = new User
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Mobile = registerDto.Mobile,
                RoleId = customerRole.Id,
                IsActive = true, // کاربر به صورت پیش‌فرض فعال است
                CreatedAt = DateTime.UtcNow
            };

            // 4. اضافه کردن کاربر به دیتابیس
            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            // 5. برگرداندن پاسخ موفقیت‌آمیز
            return Ok(new { Message = "ثبت‌نام با موفقیت انجام شد." });
        }

        [HttpPost("Login")] // آدرس این API می‌شود: /api/v1/Auth/Login
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // مرحله 1: پیدا کردن کاربر بر اساس شماره موبایل
            // ما نیاز داریم که نقش کاربر را هم همراهش بیاوریم، پس از Include استفاده می‌کنیم.
            var user = await _context.Users
                                     .Include(u => u.Role) // بسیار مهم: نقش کاربر را هم از دیتابیس بخوان
                                     .SingleOrDefaultAsync(u => u.Mobile == loginDto.Mobile);

            // اگر کاربری با این شماره موبایل پیدا نشد، خطای 404 برمی‌گردانیم
            if (user == null)
            {
                var errorResponse = new ErrorResponseDto
                {
                    Message = "کاربری با این شماره موبایل یافت نشد."
                };
                return NotFound(errorResponse); // حالا یک آبجکت JSON برمی‌گردانیم
            }

            // در آینده اینجا رمز عبور را چک می‌کنیم. فعلاً از آن عبور می‌کنیم.

            // مرحله 2: تولید توکن JWT
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                // اطلاعاتی که می‌خواهیم داخل توکن قرار دهیم (Claims)
                Subject = new ClaimsIdentity(new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.MobilePhone, user.Mobile),
        new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
        new Claim(ClaimTypes.Role, user.Role.Name) // اصلاح خطای اول
    }, "jwt"), // اصلاح خطای دوم

                // زمان انقضای توکن (از appsettings.json می‌خوانیم)
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpirationInMinutes"]!)),

                // الگوریتم امضا و کلید امنیتی
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256Signature),

                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // مرحله 3: ارسال توکن به کاربر
            return Ok(new TokenDto
            {
                Token = tokenString,
                Expiration = token.ValidTo
            });
        }
    }
}
