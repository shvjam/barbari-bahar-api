namespace BarbariBahar.API.Data.Entities
{
    public class PackingServiceSubItem
    {
        // کلید خارجی به سرویس اصلی بسته‌بندی (مثلاً "بسته‌بندی تمام لوازم")
        public int PackingServiceId { get; set; }
        public PricingFactor PackingService { get; set; }

        // کلید خارجی به آیتم زیرمجموعه (مثلاً "بسته‌بندی یخچال")
        public int SubItemId { get; set; }
        public PricingFactor SubItem { get; set; }
    }
}
