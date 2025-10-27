using BarbariBahar.API.Core.DTOs;
using BarbariBahar.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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
        private readonly Microsoft.AspNetCore.SignalR.IHubContext<BarbariBahar.API.Hubs.NotificationHub> _notificationHubContext;

        public AdminOrdersController(BarbariBaharDbContext context, Microsoft.AspNetCore.SignalR.IHubContext<BarbariBahar.API.Hubs.NotificationHub> notificationHubContext)
        {
            _context = context;
            _notificationHubContext = notificationHubContext;
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
                Driver = order.Driver != null ? new DriverInfoDto
                {
                    Id = order.Driver.Id,
                    FirstName = order.Driver.FirstName,
                    LastName = order.Driver.LastName,
                    Mobile = order.Driver.Mobile,
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

                var connectionId = BarbariBahar.API.Hubs.NotificationHub.GetConnectionId(order.CustomerId.ToString());
                if (connectionId != null)
                {
                    await _notificationHubContext.Clients.Client(connectionId).SendAsync("OrderStatusChanged", new { orderId = order.Id, newStatus = newStatus.ToString() });
                }

                return NoContent();
            }
            else
            {
                return BadRequest(new { message = "وضعیت ارسال شده معتبر نیست." });
            }
        }

        // PATCH: api/admin/orders/{id}/assign-driver
        [HttpPatch("{id}/assign-driver")]
        public async Task<IActionResult> AssignDriverToOrder(long id, [FromBody] BarbariBahar.API.Core.DTOs.Admin.AssignDriverDto assignDriverDto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "سفارش مورد نظر یافت نشد." });
            }

            var driver = await _context.Drivers.FindAsync(assignDriverDto.DriverId);
            if (driver == null)
            {
                return BadRequest(new { message = "راننده مورد نظر یافت نشد." });
            }

            if (driver.Status != Data.Enums.DriverStatus.Active)
            {
                return BadRequest(new { message = "راننده انتخاب شده در وضعیت فعال قرار ندارد." });
            }

            order.DriverId = assignDriverDto.DriverId;
            order.Status = Data.Entities.OrderStatus.InProgress;
            order.LastUpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var customerConnectionId = BarbariBahar.API.Hubs.NotificationHub.GetConnectionId(order.CustomerId.ToString());
            if (customerConnectionId != null)
            {
                await _notificationHubContext.Clients.Client(customerConnectionId).SendAsync("DriverAssigned", new { orderId = order.Id, driverDetails = new { driver.FirstName, driver.LastName, driver.CarModel, driver.CarPlateNumber } });
            }

            var driverConnectionId = BarbariBahar.API.Hubs.NotificationHub.GetConnectionId(driver.Id.ToString());
            if (driverConnectionId != null)
            {
                await _notificationHubContext.Clients.Client(driverConnectionId).SendAsync("NewOrderForDriver", new { orderId = order.Id });
            }

            return Ok(new { message = "راننده با موفقیت به سفارش تخصیص داده شد." });
        }
    }
}
