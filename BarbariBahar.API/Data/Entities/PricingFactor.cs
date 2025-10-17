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

        // این فیلد کلیدی است و نوع آیتم را مشخص می‌کند
        public PricingFactorCategory Category { get; set; }

        // برای غیرفعال کردن یک آیتم بدون حذف آن
        public bool IsActive { get; set; } = true;
    }

    // این enum برای دسته‌بندی آیتم‌ها استفاده می‌شود
    public enum PricingFactorCategory
    {
        Distance,         // هزینه مسافت (به ازای هر کیلومتر)
        Labor,            // هزینه کارگر (به ازای هر نفر)
        Stairs,           // هزینه طبقات (به ازای هر طبقه)
        Elevator,         // هزینه مربوط به آسانسور (مثلاً ضریب یا قیمت ثابت)
        WalkingDistance,  // هزینه پیاده‌روی (مثلاً به ازای هر ۱۰ متر)
        Vehicle,          // هزینه نوع ماشین (هر ماشین یک رکورد جداگانه)
        PackingService,   // سرویس‌های اصلی بسته‌بندی (مثلاً "بسته‌بندی تمام لوازم")
        PackingSubItem    // آیتم‌های زیرمجموعه بسته‌بندی (مثلاً "کارتن سایز ۱")
    }
}
