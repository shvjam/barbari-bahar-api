using BarbariBahar.API.Data;
using BarbariBahar.API.Core.DTOs.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public OrderController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        [HttpGet("servicecategories")]
        public async Task<IActionResult> GetServiceCategories()
        {
            var categories = await _context.ServiceCategories.Select(c => new { c.Id, c.Name }).ToListAsync();
            return Ok(categories);
        }

        [HttpPost("calculate-price")]
        public async Task<IActionResult> CalculatePrice([FromBody] CalculatePriceRequestDto request)
        {
            var (totalPrice, priceFactors) = await _calculatePriceAndFactors(request);
            return Ok(new { TotalPrice = totalPrice, PriceFactors = priceFactors });
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequestDto request)
        {
            var customerId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (customerId == null) return Unauthorized();

            var (finalPrice, _) = await _calculatePriceAndFactors(request);

            var newOrder = new Data.Entities.Order
            {
                CustomerId = long.Parse(customerId),
                Status = Data.Entities.OrderStatus.PendingPayment,
                FinalPrice = finalPrice,
                ScheduledAt = request.ScheduledAt,
                CreatedAt = DateTime.UtcNow,
                TrackingCode = Guid.NewGuid().ToString("N").Substring(0, 10).ToUpper()
            };

            _context.Orders.Add(newOrder);
            await _context.SaveChangesAsync();

            _context.OrderAddresses.Add(new Data.Entities.OrderAddress { OrderId = newOrder.Id, Type = Data.Entities.AddressType.Origin, Latitude = request.Origin.Latitude, Longitude = request.Origin.Longitude, FullAddress = request.Origin.FullAddress });
            _context.OrderAddresses.Add(new Data.Entities.OrderAddress { OrderId = newOrder.Id, Type = Data.Entities.AddressType.Destination, Latitude = request.Destination.Latitude, Longitude = request.Destination.Longitude, FullAddress = request.Destination.FullAddress });

            await _context.SaveChangesAsync();
            return Ok(new { OrderId = newOrder.Id, TrackingCode = newOrder.TrackingCode });
        }

        private async Task<(decimal, List<object>)> _calculatePriceAndFactors(CalculatePriceRequestDto request)
        {
            decimal totalPrice = 0;
            var priceFactors = new List<object>();

            decimal basePrice = 500000;
            totalPrice += basePrice;
            priceFactors.Add(new { Name = "هزینه اولیه سرویس", Price = basePrice });

            var distanceCostFactor = await _context.PricingFactors.FirstOrDefaultAsync(p => p.Name.Contains("کیلومتر"));
            if (distanceCostFactor != null)
            {
                var distance = Core.Helpers.DistanceCalculator.CalculateHaversineDistance(request.Origin.Latitude, request.Origin.Longitude, request.Destination.Latitude, request.Destination.Longitude);
                decimal distanceCost = (decimal)distance * distanceCostFactor.Price;
                totalPrice += distanceCost;
                priceFactors.Add(new { Name = $"هزینه مسافت ({distance:F1} کیلومتر)", Price = distanceCost });
            }

            decimal floorCost = 0;
            if (!request.OriginElevator) floorCost += request.OriginFloor * 50000;
            if (!request.DestElevator) floorCost += request.DestFloor * 50000;
            if (floorCost > 0)
            {
                totalPrice += floorCost;
                priceFactors.Add(new { Name = "هزینه طبقات (بدون آسانسور)", Price = floorCost });
            }

            if (request.Workers > 3)
            {
                decimal extraWorkerCost = (request.Workers - 3) * 150000;
                totalPrice += extraWorkerCost;
                priceFactors.Add(new { Name = $"هزینه کارگر اضافی ({request.Workers - 3} نفر)", Price = extraWorkerCost });
            }

            if (request.WalkDistance > 20)
            {
                decimal walkCost = (request.WalkDistance / 10) * 25000;
                totalPrice += walkCost;
                priceFactors.Add(new { Name = $"هزینه پیاده‌روی ({request.WalkDistance} متر)", Price = walkCost });
            }

            return (totalPrice, priceFactors);
        }

        // Other endpoints...
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            // Implementation...
            return Ok();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMyOrderById(long id)
        {
            // Implementation...
            return Ok();
        }
    }
}
