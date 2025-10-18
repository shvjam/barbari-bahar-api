using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging; // <-- این using را اضافه کن
using System.Threading.Tasks;

namespace BarbariBahar.API.Hubs
{
    public class LocationData
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class LocationHub : Hub
    {
        private readonly ILogger<LocationHub> _logger;

        // سازنده (Constructor) برای تزریق وابستگی لاگر
        public LocationHub(ILogger<LocationHub> logger)
        {
            _logger = logger;
        }

        public async Task UpdateDriverLocation(string orderId, LocationData location)
        {
            // لاگ کردن اطلاعات دریافتی
            _logger.LogInformation(
                "Driver {OrderId} location updated to (Lat: {Latitude}, Lon: {Longitude})",
                orderId,
                location.Latitude,
                location.Longitude
            );

            // TODO: در مرحله بعد، این موقعیت را برای مشتری ارسال خواهیم کرد.
            // await Clients.Group(orderId).SendAsync("ReceiveLocationUpdate", location);
        }

        public async Task JoinOrderGroup(string orderId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, orderId);
            _logger.LogInformation("Client {ConnectionId} joined group {OrderId}", Context.ConnectionId, orderId);
        }

        public async Task LeaveOrderGroup(string orderId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, orderId);
            _logger.LogInformation("Client {ConnectionId} left group {OrderId}", Context.ConnectionId, orderId);
        }
    }
}