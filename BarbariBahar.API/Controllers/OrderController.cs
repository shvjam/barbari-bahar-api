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

        // Using CreateOrderRequestDto for calculate-price as well to keep it DRY
        [HttpPost("calculate-price")]
        public async Task<IActionResult> CalculatePrice([FromBody] CreateOrderRequestDto request)
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

            // In a real application, you would also save the order items (heavy items, packaging, etc.) to the database for record-keeping.

            await _context.SaveChangesAsync();
            return Ok(new { OrderId = newOrder.Id, TrackingCode = newOrder.TrackingCode });
        }

        private async Task<(decimal, List<object>)> _calculatePriceAndFactors(CreateOrderRequestDto request)
        {
            decimal totalPrice = 0;
            var priceFactors = new List<object>();

            // 1. Base Price
            decimal basePrice = 500000;
            totalPrice += basePrice;
            priceFactors.Add(new { Name = "هزینه اولیه سرویس", Price = basePrice });

            // 2. Distance Cost
            var distanceCostFactor = await _context.PricingFactors.FirstOrDefaultAsync(p => p.Name.Contains("کیلومتر"));
            if (distanceCostFactor != null)
            {
                var distance = Core.Helpers.DistanceCalculator.CalculateHaversineDistance(request.Origin.Latitude, request.Origin.Longitude, request.Destination.Latitude, request.Destination.Longitude);
                decimal distanceCost = (decimal)distance * distanceCostFactor.Price;
                totalPrice += distanceCost;
                priceFactors.Add(new { Name = $"هزینه مسافت ({distance:F1} کیلومتر)", Price = distanceCost });
            }

            // 3. Floor & Elevator Cost
            decimal floorCost = 0;
            if (!request.OriginElevator) floorCost += request.OriginFloor * 50000;
            if (!request.DestElevator) floorCost += request.DestFloor * 50000;
            if (floorCost > 0)
            {
                totalPrice += floorCost;
                priceFactors.Add(new { Name = "هزینه طبقات (بدون آسانسور)", Price = floorCost });
            }

            // 4. Worker Cost
            if (request.Workers > 3) // Assuming 3 is the base
            {
                decimal extraWorkerCost = (request.Workers - 3) * 150000;
                totalPrice += extraWorkerCost;
                priceFactors.Add(new { Name = $"هزینه کارگر اضافی ({request.Workers - 3} نفر)", Price = extraWorkerCost });
            }

            // 5. Walk Distance Cost
            if (request.WalkDistance > 20) // Assuming 20m is base
            {
                decimal walkCost = (request.WalkDistance / 10) * 25000;
                totalPrice += walkCost;
                priceFactors.Add(new { Name = $"هزینه پیاده‌روی ({request.WalkDistance} متر)", Price = walkCost });
            }

            // 6. Heavy Items Cost
            if (request.HeavyItems != null && request.HeavyItems.Any())
            {
                var heavyItemPrices = new Dictionary<string, decimal> { { "fridge", 750000 }, { "sofa", 350000 } }; // Example prices
                decimal heavyItemsTotal = 0;
                foreach(var item in request.HeavyItems)
                {
                    if(heavyItemPrices.TryGetValue(item.ItemId, out var price))
                    {
                        heavyItemsTotal += price * item.Quantity;
                    }
                }
                if(heavyItemsTotal > 0)
                {
                    totalPrice += heavyItemsTotal;
                    priceFactors.Add(new { Name = "هزینه اقلام سنگین", Price = heavyItemsTotal });
                }
            }

            return (totalPrice, priceFactors);
        }

        // Other endpoints remain unchanged...
    }
}
