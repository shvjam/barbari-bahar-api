using BarbariBahar.API.Data;
using BarbariBahar.API.Core.DTOs.Auth;
using BarbariBahar.API.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System;
using System.Threading.Tasks;


namespace BarbariBahar.API.Controllers
{
    [Route("api/[controller]")]
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

        // ===============================================
        // 1. ENDPOINT: ارسال کد برای ورود کاربر موجود
        // ===============================================
        [HttpPost("login-send-otp")]
        public async Task<IActionResult> LoginSendOtp([FromBody] SendOtpRequestDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Mobile == request.Phone);
            if (user == null)
            {
                return NotFound(new { message = "کاربری با این شماره موبایل یافت نشد. لطفا ابتدا ثبت‌نام کنید." });
            }

            var otpCode = new Random().Next(100000, 999999).ToString();
            var expires = DateTime.UtcNow.AddMinutes(2);

            var otpRequest = new OtpRequest
            {
                Mobile = request.Phone,
                Code = otpCode,
                ExpiresAt = expires,
                IsUsed = false,
                CreatedAt = DateTime.UtcNow
            };

            await _context.OtpRequests.AddAsync(otpRequest);
            await _context.SaveChangesAsync();

            // TODO: پیاده‌سازی منطق ارسال SMS واقعی
            Console.WriteLine($"OTP for {request.Phone}: {otpCode}");

            return Ok(new
            {
                message = "کد تایید با موفقیت ارسال شد.",
                requestId = otpRequest.Id
            });
        }

        // ===============================================
        // 2. ENDPOINT: تایید کد و ورود کاربر
        // ===============================================
        [HttpPost("login-verify-otp")]
        public async Task<IActionResult> LoginVerifyOtp([FromBody] VerifyLoginOtpDto request)
        {
            var otpRequest = await _context.OtpRequests
                .FirstOrDefaultAsync(o => o.Id == request.RequestId && o.Mobile == request.Phone && o.Code == request.Code && !o.IsUsed && o.ExpiresAt > DateTime.UtcNow);

            if (otpRequest == null)
            {
                return BadRequest(new { message = "کد وارد شده صحیح نیست یا منقضی شده است." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Mobile == request.Phone);
            if (user == null)
            {
                // این اتفاق نباید بیفتد چون در مرحله قبل چک شده
                return NotFound(new { message = "کاربر یافت نشد." });
            }

            otpRequest.IsUsed = true;
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            return Ok(new
            {
                message = "ورود با موفقیت انجام شد.",
                token,
                user = new // برگرداندن اطلاعات پایه کاربر
                {
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    user.Mobile,
                    Role = user.GetType().Name // "Customer" or "Driver"
                }
            });
        }

        // ===============================================
        // 3. ENDPOINT: ارسال کد برای ثبت‌نام کاربر جدید
        // ===============================================
        [HttpPost("register-send-otp")]
        public async Task<IActionResult> RegisterSendOtp([FromBody] SendOtpRequestDto request)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Mobile == request.Phone);
            if (existingUser != null)
            {
                return BadRequest(new { message = "این شماره موبایل قبلا در سیستم ثبت‌نام کرده است. لطفا از صفحه ورود اقدام کنید." });
            }

            var otpCode = new Random().Next(100000, 999999).ToString();
            var expires = DateTime.UtcNow.AddMinutes(2);

            var otpRequest = new OtpRequest
            {
                Mobile = request.Phone,
                Code = otpCode,
                ExpiresAt = expires,
                IsUsed = false,
                CreatedAt = DateTime.UtcNow
            };

            await _context.OtpRequests.AddAsync(otpRequest);
            await _context.SaveChangesAsync();

            // TODO: پیاده‌سازی منطق ارسال SMS واقعی
            Console.WriteLine($"OTP for {request.Phone}: {otpCode}");

            return Ok(new
            {
                message = "کد تایید برای ثبت‌نام ارسال شد.",
                requestId = otpRequest.Id
            });
        }

        // ===============================================
        // 4. ENDPOINT: تایید کد و ساخت کاربر جدید
        // ===============================================
        [HttpPost("register-verify-otp")]
        public async Task<IActionResult> RegisterVerifyOtp([FromBody] VerifyRegisterOtpDto request)
        {
            var otpRequest = await _context.OtpRequests
                .FirstOrDefaultAsync(o => o.Id == request.RequestId && o.Mobile == request.Phone && o.Code == request.Code && !o.IsUsed && o.ExpiresAt > DateTime.UtcNow);

            if (otpRequest == null)
            {
                return BadRequest(new { message = "کد وارد شده صحیح نیست یا منقضی شده است." });
            }

            // دوباره چک می‌کنیم که در فاصله ارسال و تایید OTP، کاربر دیگری با این شماره ثبت‌نام نکرده باشد
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Mobile == request.Phone);
            if (existingUser != null)
            {
                return BadRequest(new { message = "این شماره موبایل قبلا ثبت شده است." });
            }

            otpRequest.IsUsed = true; // کد استفاده شد

            User newUser;

            if (request.Role == "Driver")
            {
                // اعتبارسنجی فیلدهای راننده
                if (string.IsNullOrWhiteSpace(request.NationalCode) || string.IsNullOrWhiteSpace(request.CarModel) || string.IsNullOrWhiteSpace(request.CarPlateNumber))
                {
                    return BadRequest(new { message = "برای ثبت‌نام به عنوان راننده، کد ملی، مدل خودرو و شماره پلاک الزامی است." });
                }

                newUser = new Driver
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Mobile = request.Phone,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    NationalCode = request.NationalCode,
                    CarModel = request.CarModel,
                    CarPlateNumber = request.CarPlateNumber
                };
            }
            else // Role is "Customer"
            {
                newUser = new Customer
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Mobile = request.Phone,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };
            }

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(newUser);
            return Ok(new
            {
                message = "ثبت‌نام با موفقیت انجام شد.",
                token,
                user = new
                {
                    newUser.Id,
                    newUser.FirstName,
                    newUser.LastName,
                    newUser.Mobile,
                    Role = newUser.GetType().Name
                }
            });
        }


        // ===============================================
        // متد کمکی برای ساخت توکن
        // ===============================================
        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["Key"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];

            if (string.IsNullOrEmpty(secretKey))
            {
                // این خطا حالا باید در لاگ سرور ثبت شود
                throw new InvalidOperationException("JWT Key not configured.");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("role", user.Role.ToString())
            // می‌توانید claim های دیگری مثل نام کاربر و... را هم اضافه کنید
        };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddHours(1), // زمان انقضای توکن
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
