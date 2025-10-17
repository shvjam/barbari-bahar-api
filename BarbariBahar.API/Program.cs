// using های لازم در بالای فایل
using BarbariBahar.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using BarbariBahar.API.Data.Entities;

var builder = WebApplication.CreateBuilder(args);

// 1. خواندن Connection String
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. اضافه کردن DbContext
builder.Services.AddDbContext<BarbariBaharDbContext>(options =>
    options.UseSqlServer(connectionString));

// 3. اضافه کردن سرویس OTP
builder.Services.AddScoped<OtpRequest>();

builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        });
builder.Services.AddEndpointsApiExplorer();

// 4. پیکربندی Swagger برای ارسال توکن (مهم برای تست‌های آینده)
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token in the text input below.\n\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\""
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});


// --- بخش حیاتی: پیکربندی JWT Authentication ---

// 5. خواندن کلید مخفی از appsettings
var jwtKey = builder.Configuration["JwtSettings:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT Key not configured."); // یک بررسی اولیه برای جلوگیری از خطای زمان اجرا
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)) // تبدیل کلید به بایت
    };
});

// این سرویس را برای کنترلرها لازم داریم
builder.Services.AddAuthorization();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// --- بخش حیاتی: فعال‌سازی Middleware های Authentication ---

// 6. این دو خط باید حتماً بین UseHttpsRedirection و MapControllers باشند
// و ترتیبشان هم مهم است! اول Authentication و بعد Authorization.
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
