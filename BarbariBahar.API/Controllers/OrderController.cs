using BarbariBahar.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // All endpoints in this controller require authentication
    public class OrderController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public OrderController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        // GET: api/order/servicecategories
        [HttpGet("servicecategories")]
        public async Task<IActionResult> GetServiceCategories()
        {
            var categories = await _context.ServiceCategories
                .Select(c => new { c.Id, c.Name })
                .ToListAsync();
            return Ok(categories);
        }

        // POST: api/order/calculate-price
        [HttpPost("calculate-price")]
        public async Task<IActionResult> CalculatePrice([FromBody] BarbariBahar.API.Core.DTOs.Order.CalculatePriceRequestDto request)
        {
            decimal totalPrice = 0;

            // 1. Calculate distance cost
            var distanceCostFactor = await _context.PricingFactors
                .FirstOrDefaultAsync(p => p.Name.Contains("کیلومتر")); // Assuming a naming convention

            if (distanceCostFactor != null)
            {
                var distance = BarbariBahar.API.Core.Helpers.DistanceCalculator.CalculateHaversineDistance(
                    request.Origin.Latitude, request.Origin.Longitude,
                    request.Destination.Latitude, request.Destination.Longitude);

                totalPrice += (decimal)distance * distanceCostFactor.Price;
            }

            // 2. Calculate service costs
            if (request.PricingFactorIds != null && request.PricingFactorIds.Any())
            {
                var serviceCost = await _context.PricingFactors
                    .Where(p => request.PricingFactorIds.Contains(p.Id))
                    .SumAsync(p => p.Price);
                totalPrice += serviceCost;
            }

            // 3. Calculate packaging product costs
            if (request.PackagingProducts != null && request.PackagingProducts.Any())
            {
                foreach (var item in request.PackagingProducts)
                {
                    var product = await _context.PackagingProducts.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        totalPrice += product.Price * item.Quantity;
                    }
                }
            }

            return Ok(new { TotalPrice = totalPrice });
        }

        // POST: api/order
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] BarbariBahar.API.Core.DTOs.Order.CreateOrderRequestDto request)
        {
            var customerId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (customerId == null)
            {
                return Unauthorized();
            }

            var newOrder = new BarbariBahar.API.Data.Entities.Order
            {
                CustomerId = long.Parse(customerId),
                Status = BarbariBahar.API.Data.Entities.OrderStatus.PendingPayment,
                FinalPrice = request.FinalPrice,
                ScheduledAt = request.ScheduledAt,
                CreatedAt = DateTime.UtcNow,
                TrackingCode = Guid.NewGuid().ToString("N").Substring(0, 10).ToUpper()
            };

            _context.Orders.Add(newOrder);
            await _context.SaveChangesAsync(); // Save to get OrderId

            // Add Addresses
            _context.OrderAddresses.Add(new BarbariBahar.API.Data.Entities.OrderAddress { OrderId = newOrder.Id, Type = BarbariBahar.API.Data.Entities.AddressType.Origin, Latitude = request.Origin.Latitude, Longitude = request.Origin.Longitude, FullAddress = request.Origin.FullAddress });
            _context.OrderAddresses.Add(new BarbariBahar.API.Data.Entities.OrderAddress { OrderId = newOrder.Id, Type = BarbariBahar.API.Data.Entities.AddressType.Destination, Latitude = request.Destination.Latitude, Longitude = request.Destination.Longitude, FullAddress = request.Destination.FullAddress });

            // Add OrderItems
            if (request.PricingFactorIds != null)
            {
                var factors = await _context.PricingFactors.Where(p => request.PricingFactorIds.Contains(p.Id)).ToListAsync();
                foreach (var factor in factors)
                {
                    _context.OrderItems.Add(new BarbariBahar.API.Data.Entities.OrderItem { OrderId = newOrder.Id, ItemName = factor.Name, Quantity = 1, UnitPrice = factor.Price, TotalPrice = factor.Price });
                }
            }

            if (request.PackagingProducts != null)
            {
                foreach (var item in request.PackagingProducts)
                {
                    var product = await _context.PackagingProducts.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        _context.OrderItems.Add(new BarbariBahar.API.Data.Entities.OrderItem { OrderId = newOrder.Id, ItemName = product.Name, Quantity = item.Quantity, UnitPrice = product.Price, TotalPrice = product.Price * item.Quantity });
                    }
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { OrderId = newOrder.Id, TrackingCode = newOrder.TrackingCode });
        }

        // GET: api/order/my-orders
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var customerIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!long.TryParse(customerIdStr, out var customerId))
            {
                return Unauthorized();
            }

            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new BarbariBahar.API.Core.DTOs.Order.CustomerOrderSummaryDto
                {
                    Id = o.Id,
                    TrackingCode = o.TrackingCode,
                    Status = o.Status.ToString(),
                    FinalPrice = o.FinalPrice,
                    CreatedAt = o.CreatedAt
                })
                .ToListAsync();

            return Ok(orders);
        }

        // GET: api/order/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMyOrderById(long id)
        {
            var customerIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!long.TryParse(customerIdStr, out var customerId))
            {
                return Unauthorized();
            }

            var order = await _context.Orders
                .Include(o => o.OrderAddresses)
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id && o.CustomerId == customerId);

            if (order == null)
            {
                return NotFound(new { message = "سفارش مورد نظر یافت نشد." });
            }

            var orderDetail = new BarbariBahar.API.Core.DTOs.Order.CustomerOrderDetailDto
            {
                Id = order.Id,
                TrackingCode = order.TrackingCode,
                Status = order.Status.ToString(),
                FinalPrice = order.FinalPrice,
                CreatedAt = order.CreatedAt,
                ScheduledAt = order.ScheduledAt,
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
    }
}
