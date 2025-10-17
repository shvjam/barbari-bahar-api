namespace BarbariBahar.API.Core.DTOs.User
{
    // این DTO فقط برای پاسخ‌های مربوط به احراز هویت و Session کاربر استفاده می‌شود
    public class UserDto
    {
        public int Id { get; set; }
        public string? FirstName { get; set; } // Nullable چون ممکن است کاربر جدید باشد
        public string? LastName { get; set; }  // Nullable
        public string Mobile { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty; // نام نقش را اینجا می‌گذاریم

        // فیلدهای اختصاصی راننده (اختیاری)
        public string? NationalCode { get; set; } // <<-- اضافه شد
        public string? CarModel { get; set; }     // <<-- اضافه شد
        public string? CarPlateNumber { get; set; } // <<-- اضافه شد

    }

}
