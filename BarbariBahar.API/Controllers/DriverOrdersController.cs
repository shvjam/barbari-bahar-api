using BarbariBahar.API.Data;
using BarbariBahar.API.Data.Entities;
using BarbariBahar.API.Core.DTOs.Driver;
using BarbariBahar.API.Core.DTOs.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/driver/orders")]
    [Authorize(Roles = "Driver")]
    public class DriverOrdersController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public DriverOrdersController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        // GET: api/driver/orders
        [HttpGet]
        public async Task<IActionResult> GetMyOrders([FromQuery] OrderStatus? status)
        {
            var driverIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!long.TryParse(driverIdStr, out var driverId))
            {
                return Unauthorized();
            }

            var query = _context.Orders
                .Where(o => o.DriverId == driverId);

            if (status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }
            else
            {
                // By default, return active orders
                query = query.Where(o => o.Status == OrderStatus.InProgress);
            }

            var orders = await query
                .Include(o => o.OrderAddresses)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new DriverOrderSummaryDto
                {
                    Id = o.Id,
                    TrackingCode = o.TrackingCode,
                    Status = o.Status.ToString(),
                    CreatedAt = o.CreatedAt,
                    OriginAddress = o.OrderAddresses.FirstOrDefault(a => a.Type == AddressType.Origin).FullAddress,
                    DestinationAddress = o.OrderAddresses.FirstOrDefault(a => a.Type == AddressType.Destination).FullAddress
                })
                .ToListAsync();

            return Ok(orders);
        }

        // GET: api/driver/orders/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetail(long id)
        {
            var driverIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!long.TryParse(driverIdStr, out var driverId))
            {
                return Unauthorized();
            }

            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderAddresses)
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id && o.DriverId == driverId);

            if (order == null)
            {
                return NotFound(new { message = "سفارش مورد نظر یافت نشد." });
            }

            var orderDetail = new DriverOrderDetailDto
            {
                Id = order.Id,
                TrackingCode = order.TrackingCode,
                Status = order.Status.ToString(),
                CreatedAt = order.CreatedAt,
                ScheduledAt = order.ScheduledAt,
                Customer = new CustomerInfoDto
                {
                    FullName = order.Customer.FirstName + " " + order.Customer.LastName,
                    Mobile = order.Customer.Mobile
                },
                Addresses = order.OrderAddresses.Select(a => new AddressDetailDto
                {
                    Type = a.Type.ToString(),
                    FullAddress = a.FullAddress,
                    Latitude = a.Latitude,
                    Longitude = a.Longitude
                }).ToList(),
                Items = order.OrderItems.Select(i => new OrderItemDetailDto
                {
                    ItemName = i.ItemName,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    TotalPrice = i.TotalPrice
                }).ToList()
            };

            return Ok(orderDetail);
        }

        // PATCH: api/driver/orders/{id}/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(long id, [FromBody] UpdateOrderStatusDto updateStatusDto)
        {
            var driverIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!long.TryParse(driverIdStr, out var driverId))
            {
                return Unauthorized();
            }

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id && o.DriverId == driverId);
            if (order == null)
            {
                return NotFound(new { message = "سفارش مورد نظر یافت نشد یا به شما تعلق ندارد." });
            }

            if (!Enum.TryParse<OrderStatus>(updateStatusDto.NewStatus, true, out var newStatus))
            {
                return BadRequest(new { message = "وضعیت ارسال شده معتبر نیست." });
            }

            // Business logic validation for status transition
            var validTransitions = new Dictionary<OrderStatus, OrderStatus[]>
            {
                { OrderStatus.InProgress, new[] { OrderStatus.HeadingToOrigin, OrderStatus.Completed } },
                { OrderStatus.HeadingToOrigin, new[] { OrderStatus.InProgress } } // e.g., driver has arrived at origin
            };

            if (validTransitions.ContainsKey(order.Status) && validTransitions[order.Status].Contains(newStatus))
            {
                order.Status = newStatus;
                order.LastUpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return Ok(new { message = $"وضعیت سفارش با موفقیت به '{newStatus}' تغییر یافت." });
            }
            // Add other valid transitions here if needed in the future

            return BadRequest(new { message = $"تغییر وضعیت از '{order.Status}' به '{newStatus}' مجاز نیست." });
        }
    }
}
