// این using ها مسیر کلاس های User, Role و OtpRequest را به کامپایلر نشان می دهند
using BarbariBahar.API.Data.Entities;
using Microsoft.EntityFrameworkCore;


// Namespace خود فایل DbContext
namespace BarbariBahar.API.Data
{
    public class BarbariBaharDbContext : DbContext
    {
        public BarbariBaharDbContext(DbContextOptions<BarbariBaharDbContext> options) : base(options) { }
        public DbSet<PricingFactor> PricingFactors { get; set; }
        public DbSet<PackagingProduct> PackagingProducts { get; set; }
        public DbSet<PackagingProductCategory> PackagingProductCategories { get; set; }
        // لیست تمام جداول دیتابیس ما
        public DbSet<User> Users { get; set; }

        // این DbSet ها برای دسترسی مستقیم به انواع خاصی از کاربران مفید هستند.
        // مثلا وقتی می‌خواهیم فقط لیست راننده‌ها را بگیریم.
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Admin> Admins { get; set; }

        // این خط جدول درخواست‌های OTP را با آدرس صحیح به Entity Framework معرفی می‌کند
        public DbSet<OtpRequest> OtpRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // --- پیکربندی اصلی TPH برای موجودیت User ---
            modelBuilder.Entity<User>()
                .ToTable("Users") // صراحتاً نام جدول را مشخص می‌کنیم
                .HasDiscriminator<Role>("Role") // صراحتاً می‌گوییم نوع Discriminator از enum Role است و نام ستون "Role"
                .HasValue<Customer>(Role.Customer)
                .HasValue<Driver>(Role.Driver)
                .HasValue<Admin>(Role.Admin);

            // و برای اینکه ستون "Role" در دیتابیس به صورت رشته ذخیره شود:
            modelBuilder.Entity<User>()
                .Property("Role") // به ستون "Role" که به عنوان Discriminator تعریف شده اشاره می‌کنیم
                .HasConversion<string>();


            // --- سایر پیکربندی‌ها ---
            modelBuilder.Entity<OtpRequest>(entity =>
            {
                entity.Property(e => e.UserId).IsRequired(false);
                entity.HasOne(otp => otp.User)
                      .WithMany(user => user.OtpRequests)
                      .HasForeignKey(otp => otp.UserId);
            });




            // 1. تعریف کلید اصلی ترکیبی (Composite Key) برای جدول واسط
            modelBuilder.Entity<PackingServiceSubItem>()
                .HasKey(pssi => new { pssi.PackingServiceId, pssi.SubItemId });

            // 2. تعریف رابطه از سمت "سرویس بسته‌بندی اصلی"
            modelBuilder.Entity<PackingServiceSubItem>()
                .HasOne(pssi => pssi.PackingService) // هر ردیف در جدول واسط به یک سرویس اصلی تعلق دارد
                .WithMany() // یک سرویس اصلی می‌تواند چندین آیتم زیرمجموعه داشته باشد
                .HasForeignKey(pssi => pssi.PackingServiceId) // کلید خارجی
                .OnDelete(DeleteBehavior.Restrict); // جلوگیری از حذف آبشاری برای امنیت داده

            // 3. تعریف رابطه از سمت "آیتم زیرمجموعه"
            modelBuilder.Entity<PackingServiceSubItem>()
                .HasOne(pssi => pssi.SubItem) // هر ردیف در جدول واسط به یک آیتم زیرمجموعه تعلق دارد
                .WithMany() // یک آیتم زیرمجموعه می‌تواند در چندین سرویس اصلی استفاده شود
                .HasForeignKey(pssi => pssi.SubItemId) // کلید خارجی
                .OnDelete(DeleteBehavior.Restrict); // جلوگیری از حذف آبشاری

            // ----------- پیکربندی‌های دیگر (اختیاری اما پیشنهادی) -----------

            // تنظیم می‌کنیم که قیمت‌ها حتما با دقت بالا در دیتابیس ذخیره شوند
            modelBuilder.Entity<PricingFactor>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18, 2)");

            modelBuilder.Entity<PackagingProduct>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18, 2)");

        }
    }
}