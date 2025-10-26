namespace BarbariBahar.API.Data.Entities
{
    public class Customer : User
    {
        // کانستراکتور برای تعیین Role پیش‌فرض
        public Customer()
        {
            Role = Role.Customer;
        }

        // در آینده می‌توانید ویژگی‌های اختصاصی Customer را اینجا اضافه کنید.
        public virtual System.Collections.Generic.ICollection<Order> Orders { get; set; }
    }
}
