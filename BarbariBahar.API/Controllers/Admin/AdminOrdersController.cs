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
    [Route("api/admin/orders")]
    [Authorize(Roles = "Admin")]
    public class AdminOrdersController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public AdminOrdersController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/orders
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Select(o => new BarbariBahar.API.Core.DTOs.Admin.OrderSummaryDto
                {
                    Id = o.Id,
                    TrackingCode = o.TrackingCode,
                    CustomerName = o.Customer.FirstName + " " + o.Customer.LastName,
                    Status = o.Status.ToString(),
                    FinalPrice = o.FinalPrice,
                    CreatedAt = o.CreatedAt
                })
                .ToListAsync();

            return Ok(orders);
        }

        // GET: api/admin/orders/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(long id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Driver)
                .Include(o => o.OrderAddresses)
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound(new { message = "سفارش مورد نظر یافت نشد." });
            }

            var orderDetail = new BarbariBahar.API.Core.DTOs.Admin.OrderDetailDto
            {
                Id = order.Id,
                TrackingCode = order.TrackingCode,
                Status = order.Status.ToString(),
                FinalPrice = order.FinalPrice,
                CreatedAt = order.CreatedAt,
                ScheduledAt = order.ScheduledAt,
                Customer = new BarbariBahar.API.Core.DTOs.Admin.CustomerInfoDto
                {
                    Id = order.Customer.Id,
                    FullName = order.Customer.FirstName + " " + order.Customer.LastName,
                    PhoneNumber = order.Customer.Mobile
                },
                Driver = order.Driver != null ? new BarbariBahar.API.Core.DTOs.Admin.DriverInfoDto
                {
                    Id = order.Driver.Id,
                    FullName = order.Driver.FirstName + " " + order.Driver.LastName,
                    PhoneNumber = order.Driver.Mobile,
                    CarModel = order.Driver.CarModel,
                    CarPlateNumber = order.Driver.CarPlateNumber
                } : null,
                Addresses = order.OrderAddresses.Select(a => new BarbariBahar.API.Core.DTOs.Admin.AddressDetailDto
                {
                    Type = a.Type.ToString(),
                    FullAddress = a.FullAddress,
                    Latitude = a.Latitude,
                    Longitude = a.Longitude
                }).ToList(),
                Items = order.OrderItems.Select(i => new BarbariBahar.API.Core.DTOs.Admin.OrderItemDetailDto
                {
                    ItemName = i.ItemName,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    TotalPrice = i.TotalPrice
                }).ToList()
            };

            return Ok(orderDetail);
        }

        // PATCH: api/admin/orders/{id}/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(long id, [FromBody] BarbariBahar.API.Core.DTOs.Admin.UpdateOrderStatusDto updateStatusDto)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound(new { message = "سفارش مورد نظر یافت نشد." });
            }

            if (Enum.TryParse<BarbariBahar.API.Data.Entities.OrderStatus>(updateStatusDto.NewStatus, true, out var newStatus))
            {
                order.Status = newStatus;
                order.LastUpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            else
            {
                return BadRequest(new { message = "وضعیت ارسال شده معتبر نیست." });
            }
        }
    }
}
