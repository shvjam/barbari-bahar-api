using BarbariBahar.API.Core.DTOs;
using BarbariBahar.API.Core.DTOs.User;
using BarbariBahar.API.Core.DTOs.Auth;
using BarbariBahar.API.Data;
using BarbariBahar.API.Data.Entities; // <--- using برای User
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace BarbariBahar.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        // ما دیگر به UserManager نیازی نداریم، پس آن را حذف می‌کنیم.
        public AuthController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // چون شماره همیشه با فرمت "09..." می‌آید، نیازی به تبدیل نیست.
            // مستقیم با همان شماره کار می‌کنیم.
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Mobile == request.phone);

            if (user == null)
            {
                user = new User
                {
                    Mobile = request.phone,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true, // یا هر مقدار پیش‌فرض دیگری
                    RoleId = 1, // ID نقش پیش‌فرض (مثلاً Customer). مطمئن شو چنین نقشی در دیتابیس داری.
                    FirstName = null, // در ابتدا نام ندارد
                    LastName = null,  // در ابتدا نام خانوادگی ندارد
                };
                _context.Users.Add(user);
                // اینجا save نکن، در انتها یکجا همه چیز ذخیره می‌شود.
            }

            var otpCode = GenerateRandomOtp();

            // غیرفعال کردن کدهای قبلی کاربر (این یک بهینه‌سازی خوب است)
            var previousOtps = await _context.OtpRequests
                                             .Where(o => o.UserId == user.Id && !o.IsUsed)
                                             .ToListAsync();
            foreach (var oldOtp in previousOtps)
            {
                oldOtp.IsUsed = true; // یا می‌توانید آنها را حذف کنید
            }

            // ساخت رکورد OTP جدید
            var otpRequest = new OtpRequest
            {
                User = user, // <<--- روش بهتر: به جای UserId، کل شیء User را پاس بده
                Code = otpCode,
                ExpiresAt = DateTime.UtcNow.AddMinutes(2), // کد برای ۲ دقیقه معتبر است
                CreatedAt = DateTime.UtcNow,
                IsUsed = false
            };

            _context.OtpRequests.Add(otpRequest);

            // حالا با یک بار SaveChanges، هم کاربر جدید (اگر وجود داشت) و هم کد OTP جدید ذخیره می‌شوند.
            await _context.SaveChangesAsync(); // این خط دیگر خطا نمی‌دهد

            // نمایش کد OTP در لاگ یا toast برای تست (در حالت پروداکشن این خط باید حذف شود)
            System.Diagnostics.Debug.WriteLine($"OTP for {request.phone} is: {otpCode}");
            // یا می‌توانید آن را در هدر پاسخ برای تست برگردانید.

            return Ok(new
            {
                Message = "کد تایید با موفقیت ارسال شد.",
                RequestId = otpRequest.Id // ID رکورد OTP را برای مرحله بعد به فرانت‌اند می‌فرستیم
            });
        }


        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequestDto request)
        {
            // در این متد هم باید دنبال درخواست OTP بر اساس requestId بگردیم
            // و نه شماره تلفن. کد قبلی شما درست بود.
            var otpRequest = await _context.OtpRequests
                // من `Include(o => o.User)` را اضافه می‌کنم تا کاربر همزمان لود شود و یک کوئری به دیتابیس کمتر بزنیم
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == request.requestId && o.Code == request.code && !o.IsUsed);

            if (otpRequest == null)
            {
                return BadRequest(new ErrorResponseDto { Message = "کد تایید نادرست یا استفاده شده است." });
            }

            if (otpRequest.ExpiresAt < DateTime.UtcNow)
            {
                otpRequest.IsUsed = true; // کد منقضی را هم به عنوان استفاده شده علامت بزن
                await _context.SaveChangesAsync();
                return BadRequest(new ErrorResponseDto { Message = "کد منقضی شده است." });
            }

            // چون از Include استفاده کردیم، دیگر نیازی به خط زیر نیست
            // var user = await _context.Users.FindAsync(otpRequest.UserId);
            var user = await _context.Users
                                 .Include(u => u.Role) // <<-- این خط، جدول Roles را به کوئری Join می‌کند
                                 .FirstOrDefaultAsync(u => u.Id == otpRequest.UserId);
            if (user == null)
            {
                // این حالت خیلی بعید است ولی برای اطمینان
                return NotFound(new ErrorResponseDto { Message = "کاربر مرتبط با این کد یافت نشد." });
            }

            otpRequest.IsUsed = true;
            await _context.SaveChangesAsync();

            var fakeToken = $"FAKE_JWT_TOKEN_FOR_USER_{user.Id}_{Guid.NewGuid()}";

            var response = new VerifyOtpResponseDto
            {
                Message = "ورود با موفقیت انجام شد",
                Token = fakeToken,
                User = new UserDto
                {
                    Id = user.Id,
                    Mobile = user.Mobile,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    // اینجا نقش کاربر را از شیء Role که Include کردیم می‌خوانیم
                    Role = user.Role?.Name ?? "Customer" // <<-- این خط اضافه شد. اگر نقش نداشت، پیش‌فرض Customer باشد
                }
            };

            return Ok(response);
        }


        private string GenerateRandomOtp()
        {
            // یک کد 6 رقمی تولید می‌کند
            return new Random().Next(100000, 1000000).ToString("D6");
        }
        private static string GenerateRandomOtp(int length = 6)
        {
            // این تابع قبلی ممکن است گاهی کد 5 رقمی تولید کند. این نسخه بهتر است.
            return new Random().Next(100000, 1000000).ToString("D6");
        }
    }
}
