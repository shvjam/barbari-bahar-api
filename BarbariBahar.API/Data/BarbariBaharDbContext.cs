
// این using ها مسیر کلاس های User, Role و OtpRequest را به کامپایلر نشان می دهند
using BarbariBahar.API.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BarbariBahar.API.Data
{
    public class BarbariBaharDbContext : DbContext
    {
        public BarbariBaharDbContext(DbContextOptions<BarbariBaharDbContext> options) : base(options) { }
        public DbSet<PricingFactor> PricingFactors { get; set; }
        public DbSet<ServiceCategory> ServiceCategories { get; set; }
        public DbSet<PackagingProduct> PackagingProducts { get; set; }
        public DbSet<PackagingProductCategory> PackagingProductCategories { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<OtpRequest> OtpRequests { get; set; }
        
        // جداول جدید مربوط به سفارشات
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderAddress> OrderAddresses { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Ticket> Tickets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .ToTable("Users")
                .HasDiscriminator<Role>("Role")
                .HasValue<Customer>(Role.Customer)
                .HasValue<Driver>(Role.Driver)
                .HasValue<Admin>(Role.Admin);

            modelBuilder.Entity<User>()
                .Property("Role")
                .HasConversion<string>();

            modelBuilder.Entity<OtpRequest>(entity =>
            {
                entity.Property(e => e.UserId).IsRequired(false);
                entity.HasOne(otp => otp.User)
                      .WithMany(user => user.OtpRequests)
                      .HasForeignKey(otp => otp.UserId);
            });

            modelBuilder.Entity<PackingServiceSubItem>()
                .HasKey(pssi => new { pssi.PackingServiceId, pssi.SubItemId });

            modelBuilder.Entity<PackingServiceSubItem>()
                .HasOne(pssi => pssi.PackingService)
                .WithMany()
                .HasForeignKey(pssi => pssi.PackingServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PackingServiceSubItem>()
                .HasOne(pssi => pssi.SubItem)
                .WithMany()
                .HasForeignKey(pssi => pssi.SubItemId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PricingFactor>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18, 2)");

            modelBuilder.Entity<PackagingProduct>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18, 2)");
                
            // --- پیکربندی‌های جدید برای سفارشات ---

            modelBuilder.Entity<Order>()
                .Property(o => o.Status)
                .HasConversion<string>();

            modelBuilder.Entity<OrderAddress>()
                .Property(a => a.Type)
                .HasConversion<string>();
            
            modelBuilder.Entity<Driver>()
                .Property(d => d.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Ticket>()
                .Property(t => t.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Ticket>()
                .Property(t => t.Priority)
                .HasConversion<string>();

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Customer)
                .WithMany(c => c.Orders)
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Driver)
                .WithMany(d => d.Orders)
                .HasForeignKey(o => o.DriverId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed Data
            modelBuilder.Entity<ServiceCategory>().HasData(
                new ServiceCategory { Id = 1, Name = "جابجایی شهری" },
                new ServiceCategory { Id = 2, Name = "حمل بار بین شهری" },
                new ServiceCategory { Id = 3, Name = "بسته بندی" }
            );

            modelBuilder.Entity<PackagingProductCategory>().HasData(
                new PackagingProductCategory { Id = 1, Name = "کارتن‌ها" },
                new PackagingProductCategory { Id = 2, Name = "لوازم محافظتی" }
            );

            modelBuilder.Entity<PackagingProduct>().HasData(
                new PackagingProduct { Id = 1, Name = "کارتن سه لایه", Price = 50000, CategoryId = 1 },
                new PackagingProduct { Id = 2, Name = "نایلون حباب دار (متری)", Price = 25000, CategoryId = 2 },
                new PackagingProduct { Id = 3, Name = "چسب پهن", Price = 30000, CategoryId = 2 }
            );

            modelBuilder.Entity<PricingFactor>().HasData(
                new PricingFactor { Id = 1, Name = "وانت", Price = 500000, ServiceCategoryId = 1, Unit = "سرویس" },
                new PricingFactor { Id = 2, Name = "کارگر", Price = 250000, ServiceCategoryId = 1, Unit = "نفر" },
                new PricingFactor { Id = 3, Name = "هزینه به ازای هر کیلومتر", Price = 10000, ServiceCategoryId = 2, Unit = "کیلومتر" }
            );
        }
    }
}
