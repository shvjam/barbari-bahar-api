using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BarbariBahar.API.Data;
using Microsoft.EntityFrameworkCore;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<BarbariBaharDbContext>(options =>
       options.UseSqlServer(connectionString));
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"]!;


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // این بخش تعریف امنیت را به Swagger اضافه می‌کند
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "لطفا توکن JWT را همراه با کلمه Bearer وارد کنید (مثال: Bearer 12345abcdef)"
    });

    // این بخش به Swagger می‌گوید که برای اجرای APIها، این امنیت لازم است
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var myClientAppCorsPolicy = "AllowMyClient";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myClientAppCorsPolicy,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:8080") // آدرس فرانت‌اند شما
                                .AllowAnyHeader() // اجازه دادن به همه هدرها (مثل Content-Type, Authorization)
                                .AllowAnyMethod(); // اجازه دادن به همه متدهای HTTP (GET, POST, PUT, DELETE, etc.)
                      });
});


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });


var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(myClientAppCorsPolicy);
app.UseAuthentication(); // <-- این خط را اضافه کنید
app.UseRouting(); // <-- این خط را برای اطمینان اضافه کنید (اگر نبود)

app.UseAuthorization();

app.MapControllers();

app.Run();