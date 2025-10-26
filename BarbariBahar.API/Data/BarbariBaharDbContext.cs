
// این using ها مسیر کلاس های User, Role و OtpRequest را به کامپایلر نشان می دهند
using BarbariBahar.API.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BarbariBahar.API.Data
{
    public class BarbariBaharDbContext : DbContext
    {
        public BarbariBaharDbContext(DbContextOptions<BarbariBaharDbContext> options) : base(options) { }
        public DbSet<PricingFactor> PricingFactors { get; set; }
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
        }
    }
}
