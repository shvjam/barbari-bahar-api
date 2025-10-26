using BarbariBahar.API.Data;
using Microsoft.AspNetCore.Authorization;
﻿using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;

namespace BarbariBahar.API.Hubs
{
    public class LocationData
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    [Authorize]
    public class LocationHub : Hub
    {
        private readonly ILogger<LocationHub> _logger;
        private readonly BarbariBaharDbContext _context;

        public LocationHub(ILogger<LocationHub> logger, BarbariBaharDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task SendLocation(LocationData location)
        {
            var driverIdStr = Context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!long.TryParse(driverIdStr, out var driverId))
            {
                return; // Not a valid user or driver
            }

            // Find the active order for this driver
            var activeOrder = await _context.Orders
                .Where(o => o.DriverId == driverId && o.Status == Data.Entities.OrderStatus.InProgress)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync();

            if (activeOrder != null)
            {
                var groupName = $"Order_{activeOrder.Id}";
                _logger.LogInformation(
                    "Driver {DriverId} is sending location for order {OrderId} to group {GroupName}",
                    driverId, activeOrder.Id, groupName);

                // Send the location update to all clients in the order's group
                await Clients.Group(groupName).SendAsync("ReceiveLocationUpdate", driverId, location);
            }
        }

        public async Task SubscribeToOrder(long orderId)
        {
            var customerIdStr = Context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!long.TryParse(customerIdStr, out var customerId))
            {
                return; // Not a valid user
            }

            // Verify that the order belongs to the customer
            var orderExists = await _context.Orders
                .AnyAsync(o => o.Id == orderId && o.CustomerId == customerId);

            if (orderExists)
            {
                var groupName = $"Order_{orderId}";
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                _logger.LogInformation("Customer {CustomerId} subscribed to order {OrderId} with connection {ConnectionId}",
                    customerId, orderId, Context.ConnectionId);
            }
        }

        public async Task UnsubscribeFromOrder(long orderId)
        {
            var groupName = $"Order_{orderId}";
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            _logger.LogInformation("Client {ConnectionId} unsubscribed from group {GroupName}", Context.ConnectionId, groupName);
        }
    }
}