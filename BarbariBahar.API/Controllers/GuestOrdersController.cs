using BarbariBahar.API.Data;
using BarbariBahar.API.Core.DTOs.Guest;
using BarbariBahar.API.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/guest/orders")]
    public class GuestOrdersController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public GuestOrdersController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateGuestOrder([FromBody] CreateGuestOrderDto dto)
        {
            var order = new Order
            {
                // ... initialization ...
                Status = OrderStatus.PendingCustomerConfirmation,
                CreatedAt = DateTime.UtcNow,
                // ...
            };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return Ok(new { orderId = order.Id });
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateGuestOrder(long id, [FromBody] UpdateGuestOrderDto dto)
        {
            var order = await _context.Orders.Include(o => o.PackingItems).FirstOrDefaultAsync(o => o.Id == id);
            if (order == null || order.CustomerId != null)
            {
                return BadRequest("Invalid order.");
            }

            decimal packingTotal = 0;
            if (dto.PackagingProducts != null)
            {
                order.PackingItems.Clear();
                foreach (var item in dto.PackagingProducts)
                {
                    if (item.Quantity <= 0)
                    {
                        return BadRequest("Item quantity must be positive.");
                    }

                    var product = await _context.PackagingProducts.FindAsync(item.ProductId);
                    if (product == null)
                    {
                        return NotFound($"Product with ID {item.ProductId} not found.");
                    }

                    packingTotal += product.Price * item.Quantity;
                    order.PackingItems.Add(new PackingItemSelection
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity
                    });
                }
            }

            // Decouple price components. Assume distance/labor are calculated elsewhere.
            // This endpoint's responsibility is to update the packing items and their contribution to the total.

            // For now, let's assume the final price is just the packing total until other features are added.
            // In a real scenario, you'd fetch other cost components from the order.
            var distancePrice = 0m; // Placeholder
            var laborPrice = 0m; // Placeholder

            order.FinalPrice = distancePrice + laborPrice + packingTotal;
            await _context.SaveChangesAsync();

            var packingSupplies = order.PackingItems.Select(pi => new {
                name = _context.PackagingProducts.Find(pi.ProductId).Name,
                unitPrice = _context.PackagingProducts.Find(pi.ProductId).Price,
                quantity = pi.Quantity,
                subtotal = _context.PackagingProducts.Find(pi.ProductId).Price * pi.Quantity
            }).ToList();

            return Ok(new
            {
                distancePrice,
                laborPrice,
                packingSupplies,
                totalPrice = order.FinalPrice
            });
        }

        [HttpGet("packaging-items")]
        public IActionResult GetPackagingItems()
        {
            var items = new[]
            {
                new { id = "fridge_large", name = "یخچال ساید بای ساید", price = 150000 },
                new { id = "sofa_3seater", name = "مبل سه نفره", price = 100000 },
                new { id = "tv_large", name = "تلویزیون بالای ۵۵ اینچ", price = 75000 },
            };
            return Ok(items);
        }
    }
}
