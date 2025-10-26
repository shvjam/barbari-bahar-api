using BarbariBahar.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarbariBahar.API.Controllers
{
    [Route("api/admin/orders")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminOrdersController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public AdminOrdersController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        // Endpoints will be added here in the next step
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderAddresses)
                .Select(o => new BarbariBahar.API.Core.DTOs.Order.OrderSummaryDto
                {
                    Id = o.Id,
                    TrackingCode = o.TrackingCode,
                    CustomerName = o.Customer.FirstName + " " + o.Customer.LastName,
                    Status = o.Status.ToString(),
                    CreatedAt = o.CreatedAt,
                    FinalPrice = o.FinalPrice,
                    OriginAddress = o.OrderAddresses.FirstOrDefault(a => a.Type == BarbariBahar.API.Data.Entities.AddressType.Origin).FullAddress,
                    DestinationAddress = o.OrderAddresses.FirstOrDefault(a => a.Type == BarbariBahar.API.Data.Entities.AddressType.Destination).FullAddress
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(long id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Driver)
                .Include(o => o.OrderAddresses)
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            var orderDetail = new BarbariBahar.API.Core.DTOs.Order.OrderDetailDto
            {
                Id = order.Id,
                TrackingCode = order.TrackingCode,
                Status = order.Status.ToString(),
                CreatedAt = order.CreatedAt,
                FinalPrice = order.FinalPrice,
                Customer = new BarbariBahar.API.Core.DTOs.Order.CustomerInfoDto
                {
                    Id = order.Customer.Id,
                    FirstName = order.Customer.FirstName,
                    LastName = order.Customer.LastName,
                    Mobile = order.Customer.Mobile
                },
                Driver = order.Driver == null ? null : new BarbariBahar.API.Core.DTOs.Order.DriverInfoDto
                {
                    Id = order.Driver.Id,
                    FirstName = order.Driver.FirstName,
                    LastName = order.Driver.LastName,
                    Mobile = order.Driver.Mobile,
                    CarModel = order.Driver.CarModel,
                    CarPlateNumber = order.Driver.CarPlateNumber
                },
                Addresses = order.OrderAddresses.Select(a => new BarbariBahar.API.Core.DTOs.Order.OrderAddressDetailDto
                {
                    FullAddress = a.FullAddress,
                    Type = a.Type.ToString()
                }).ToList(),
                Items = order.OrderItems.Select(i => new BarbariBahar.API.Core.DTOs.Order.OrderItemDetailDto
                {
                    ItemName = i.ItemName,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    TotalPrice = i.TotalPrice
                }).ToList()
            };

            return Ok(orderDetail);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(long id, [FromBody] BarbariBahar.API.Core.DTOs.Order.UpdateOrderStatusRequestDto updateStatusDto)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            if (Enum.TryParse<BarbariBahar.API.Data.Entities.OrderStatus>(updateStatusDto.Status, true, out var newStatus))
            {
                order.Status = newStatus;
                await _context.SaveChangesAsync();
                return NoContent();
            }

            return BadRequest("Invalid status value.");
        }

        [HttpPut("{id}/assign-driver")]
        public async Task<IActionResult> AssignDriver(long id, [FromBody] BarbariBahar.API.Core.DTOs.Order.AssignDriverRequestDto assignDriverDto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound("Order not found.");
            }

            var driver = await _context.Drivers.FindAsync(assignDriverDto.DriverId);
            if (driver == null)
            {
                return NotFound("Driver not found.");
            }

            order.DriverId = assignDriverDto.DriverId;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
