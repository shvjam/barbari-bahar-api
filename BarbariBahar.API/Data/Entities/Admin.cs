namespace BarbariBahar.API.Data.Entities
{
    public class Admin : User
    {
        // کانستراکتور برای تعیین Role پیش‌فرض
        public Admin()
        {
            Role = Role.Admin;
        }

        // در آینده می‌توانید ویژگی‌های اختصاصی Admin را اینجا اضافه کنید.
    }
}