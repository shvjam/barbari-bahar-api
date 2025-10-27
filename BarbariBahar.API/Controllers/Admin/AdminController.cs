using BarbariBahar.API.Core.DTOs.Admin;
using BarbariBahar.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public AdminController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var today = DateTime.UtcNow.Date;

            var stats = new AdminStatsDto
            {
                PendingOrders = await _context.Orders.CountAsync(o => o.Status == Data.Entities.OrderStatus.PendingAdminApproval),
                TodayIncome = await _context.Orders
                    .Where(o => o.Status == Data.Entities.OrderStatus.Completed && o.LastUpdatedAt >= today)
                    .SumAsync(o => o.FinalPrice),
                ActiveDrivers = await _context.Drivers.CountAsync(d => d.Status == Data.Enums.DriverStatus.Active)
            };

            return Ok(stats);
        }
    }
}
