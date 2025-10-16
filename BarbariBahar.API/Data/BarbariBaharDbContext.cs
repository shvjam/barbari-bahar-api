// این using ها مسیر کلاس های User, Role و OtpRequest را به کامپایلر نشان می دهند
using BarbariBahar.API.Data.Entities;
using Microsoft.EntityFrameworkCore;

// Namespace خود فایل DbContext
namespace BarbariBahar.API.Data
{
    public class BarbariBaharDbContext : DbContext
    {
        public BarbariBaharDbContext(DbContextOptions<BarbariBaharDbContext> options) : base(options) { }

        // لیست تمام جداول دیتابیس ما
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }

        // این خط جدول درخواست‌های OTP را با آدرس صحیح به Entity Framework معرفی می‌کند
        public DbSet<OtpRequest> OtpRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // تعریف داده های اولیه برای جدول Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Customer" },
                new Role { Id = 2, Name = "Admin" },
                new Role { Id = 3, Name = "Driver" }
            );
        }
    }
}
