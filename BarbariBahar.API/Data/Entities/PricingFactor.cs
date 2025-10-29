namespace BarbariBahar.API.Data.Entities
{
    public class PricingFactor
    {
        public int Id { get; set; }

        // نام قابل نمایش برای ادمین و مشتری (مثال: "هزینه هر کیلومتر مسافت")
        public required string Name { get; set; }

        // توضیح بیشتر در مورد این آیتم (اختیاری)
        public string? Description { get; set; }

        // قیمت پایه برای این آیتم
        // حتما از نوع decimal برای مسائل مالی استفاده کنید
        public decimal Price { get; set; }

        // واحد اندازه‌گیری (مثال: "کیلومتر", "نفر", "طبقه", "سرویس", "۱۰ متر")
        public required string Unit { get; set; }

        // Foreign key to ServiceCategory
        public int ServiceCategoryId { get; set; }

        // Navigation property to ServiceCategory
        public virtual ServiceCategory ServiceCategory { get; set; } = null!;

        // برای غیرفعال کردن یک آیتم بدون حذف آن
        public bool IsActive { get; set; } = true;
    }
}
