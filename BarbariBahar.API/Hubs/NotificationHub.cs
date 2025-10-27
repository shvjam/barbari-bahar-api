using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BarbariBahar.API.Hubs
{
    public class NotificationHub : Hub
    {
        private static readonly Dictionary<string, string> UserConnections = new Dictionary<string, string>();

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                UserConnections[userId] = Context.ConnectionId;
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userId = Context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId != null && UserConnections.ContainsKey(userId))
            {
                UserConnections.Remove(userId);
            }
            await base.OnDisconnectedAsync(exception);
        }

        public static string GetConnectionId(string userId)
        {
            return UserConnections.GetValueOrDefault(userId);
        }
    }
}
