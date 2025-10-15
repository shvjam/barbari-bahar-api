using BarbariBahar.API.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BarbariBahar.API.Data
{
    public class BarbariBaharDbContext : DbContext
    {
        public BarbariBaharDbContext(DbContextOptions<BarbariBaharDbContext> options) : base(options)
        {
        }

        // DbSet ها معادل جداول دیتابیس هستند
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // اینجا می‌توانیم تنظیمات پیشرفته‌تری برای مدل‌ها تعریف کنیم. فعلا خالی می‌ماند.
        }
    }
}
