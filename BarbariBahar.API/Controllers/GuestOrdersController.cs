using BarbariBahar.API.Data;
using BarbariBahar.API.Core.DTOs.Order;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/orders/guest")]
    public class GuestOrdersController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public GuestOrdersController(BarbariBaharDbContext context) { _context = context; }

        [HttpPost]
        public async Task<IActionResult> CreateGuestOrder()
        {
            var newOrder = new Data.Entities.Order
            {
                Status = Data.Entities.OrderStatus.Draft,
                TrackingCode = Guid.NewGuid().ToString("N").Substring(0, 10).ToUpper(),
                FinalPrice = 0,
                CustomerId = null
            };
            _context.Orders.Add(newOrder);
            await _context.SaveChangesAsync();
            return Ok(new { OrderId = newOrder.Id });
        }

        [HttpPatch("{orderId}")]
        public async Task<IActionResult> UpdateGuestOrder(long orderId, [FromBody] CreateOrderRequestDto request)
        {
            var order = await _context.Orders.Include(o => o.OrderAddresses).FirstOrDefaultAsync(o => o.Id == orderId);
            if (order == null || order.CustomerId != null) return NotFound("Guest order not found.");

            // Update logic here...

            var (totalPrice, priceFactors) = await _calculatePriceAndFactors(request);
            order.FinalPrice = totalPrice;

            await _context.SaveChangesAsync();
            return Ok(new { TotalPrice = totalPrice, PriceFactors = priceFactors });
        }

        private async Task<(decimal, List<object>)> _calculatePriceAndFactors(CreateOrderRequestDto request)
        {
            decimal totalPrice = 0;
            var priceFactors = new List<object>();
            totalPrice += 500000; // Base price
            priceFactors.Add(new { Name = "هزینه اولیه سرویس", Price = 500000 });

            if (request.Origin != null && request.Destination != null)
            {
                var distanceCostFactor = await _context.PricingFactors.FirstOrDefaultAsync(p => p.Name.Contains("کیلومتر"));
                if (distanceCostFactor != null)
                {
                    var distance = Core.Helpers.DistanceCalculator.CalculateHaversineDistance(request.Origin.Latitude, request.Origin.Longitude, request.Destination.Latitude, request.Destination.Longitude);
                    decimal distanceCost = (decimal)distance * distanceCostFactor.Price;
                    totalPrice += distanceCost;
                    priceFactors.Add(new { Name = $"هزینه مسافت ({distance:F1} km)", Price = distanceCost });
                }
            }

            // ... Add all other calculation logic (floors, workers, etc.) here ...

            return (totalPrice, priceFactors);
        }
    }
}
