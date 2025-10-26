using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations; // اگر لازم شد اضافه کن


namespace BarbariBahar.API.Data.Entities
{
 

    public abstract class User
    {
        public long Id { get; set; }
        public string Mobile { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; }= string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public Role Role { get; protected set; }

        // --- حذف ارتباط مستقیم با Role ---
        // در الگوی TPH، دیگر به RoleId و جدول Roles به شکل فعلی نیازی نداریم.
        // EF Core به طور خودکار نوع کاربر (Customer, Driver, Admin) را مدیریت می‌کند.
        // پس خطوط زیر را حذف یا کامنت می‌کنیم:
        // public int RoleId { get; set; }
        // public virtual Role Role { get; set; } = null!;

        // --- ارتباط با OTP ---
        // یک کاربر می‌تواند چندین درخواست OTP داشته باشد.
        public virtual ICollection<OtpRequest> OtpRequests { get; set; } = new List<OtpRequest>();
    }
}
