using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace BarbariBahar.API.Hubs // مطمئن شو که Namespace پروژه خودت را اینجا قرار دهی
{
    // تعریف یک کلاس ساده برای داده‌های موقعیت مکانی
    // بعداً می‌توانیم آن را کامل‌تر کنیم
    public class LocationData
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class LocationHub : Hub
    {
        // این متد توسط راننده (کلاینت) فراخوانی می‌شود
        public async Task UpdateDriverLocation(string orderId, LocationData location)
        {
            // ما موقعیت جدید را به همه کلاینت‌هایی که در گروه این سفارش هستند می‌فرستیم.
            // نام گروه را همان ID سفارش در نظر می‌گیریم تا یکتا باشد.
            // کلاینت‌ها باید به رویدادی به نام "ReceiveLocationUpdate" گوش دهند.
            await Clients.Group(orderId).SendAsync("ReceiveLocationUpdate", location);
        }

        // این متد توسط هر کلاینتی (راننده، مشتری، ادمین) فراخوانی می‌شود
        // وقتی که وارد صفحه یک سفارش خاص می‌شود.
        public async Task JoinOrderGroup(string orderId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, orderId);
        }

        // این متد توسط کلاینت فراخوانی می‌شود وقتی از صفحه سفارش خارج می‌شود.
        public async Task LeaveOrderGroup(string orderId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, orderId);
        }
    }
}