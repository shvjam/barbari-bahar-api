using BarbariBahar.API.Data;
using BarbariBahar.API.Core.DTOs.Order;
using BarbariBahar.API.Data.Entities;
using BarbariBahar.API.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public OrdersController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequestDto createOrderDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !long.TryParse(userIdClaim.Value, out long userId))
            {
                return Unauthorized(new { Message = "Invalid user token." });
            }

            var customer = await _context.Customers.FindAsync(userId);
            if (customer == null)
            {
                return Forbid("User is not a customer.");
            }

            var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var pricingFactorIds = createOrderDto.Items.Select(i => i.PricingFactorId).ToList();
                var pricingFactors = await _context.PricingFactors
                                                   .Where(pf => pricingFactorIds.Contains(pf.Id))
                                                   .ToDictionaryAsync(pf => pf.Id, pf => pf);

                decimal finalPrice = 0;
                foreach (var itemDto in createOrderDto.Items)
                {
                    if (!pricingFactors.TryGetValue(itemDto.PricingFactorId, out var factor))
                    {
                        return BadRequest($"Pricing factor with ID {itemDto.PricingFactorId} not found.");
                    }
                    finalPrice += factor.Price * itemDto.Quantity;
                }

                var origin = createOrderDto.Addresses.FirstOrDefault(a => a.AddressType.Equals("Origin", StringComparison.OrdinalIgnoreCase));
                var destination = createOrderDto.Addresses.FirstOrDefault(a => a.AddressType.Equals("Destination", StringComparison.OrdinalIgnoreCase));

                if (origin != null && destination != null)
                {
                    var distanceInKm = DistanceCalculator.CalculateDistance(origin.Latitude, origin.Longitude, destination.Latitude, destination.Longitude);
                    var distanceCostFactor = await _context.PricingFactors.FirstOrDefaultAsync(pf => pf.Name == "هزینه مسافت");

                    if (distanceCostFactor != null)
                    {
                        finalPrice += (decimal)distanceInKm * distanceCostFactor.Price;
                    }
                }

                var order = new Order
                {
                    CustomerId = userId,
                    CreatedAt = DateTime.UtcNow,
                    Status = OrderStatus.PendingAdminApproval,
                    TrackingCode = Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                    FinalPrice = finalPrice,
                    OrderAddresses = new System.Collections.Generic.List<OrderAddress>(),
                    OrderItems = new System.Collections.Generic.List<OrderItem>()
                };

                foreach (var addressDto in createOrderDto.Addresses)
                {
                    order.OrderAddresses.Add(new OrderAddress
                    {
                        FullAddress = addressDto.FullAddress,
                        Type = Enum.Parse<AddressType>(addressDto.AddressType, true),
                        Latitude = addressDto.Latitude,
                        Longitude = addressDto.Longitude
                    });
                }

                foreach (var itemDto in createOrderDto.Items)
                {
                    var factor = pricingFactors[itemDto.PricingFactorId];
                    order.OrderItems.Add(new OrderItem
                    {
                        ItemName = factor.Name,
                        Quantity = itemDto.Quantity,
                        UnitPrice = factor.Price,
                        TotalPrice = itemDto.Quantity * factor.Price
                    });
                }

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new OrderConfirmationResponseDto
                {
                    OrderId = order.Id,
                    TrackingCode = order.TrackingCode
                };

                return Ok(response);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "An unexpected error occurred while creating the order.");
            }
        }
    }
}
