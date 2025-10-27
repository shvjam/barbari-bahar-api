using BarbariBahar.API.Core.DTOs.Driver;
using BarbariBahar.API.Data;
using BarbariBahar.API.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/drivers")]
    [Authorize]
    public class DriverController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public DriverController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        [HttpPut("me/location")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> UpdateLocation([FromBody] UpdateLocationDto updateLocationDto)
        {
            var driverIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (driverIdClaim == null || !long.TryParse(driverIdClaim.Value, out long driverId))
            {
                return Unauthorized(new { Message = "توکن نامعتبر یا فاقد ID راننده است." });
            }

            var driverLocation = await _context.DriverLocations.FirstOrDefaultAsync(dl => dl.DriverId == driverId);

            if (driverLocation == null)
            {
                driverLocation = new DriverLocation
                {
                    DriverId = driverId,
                    Latitude = updateLocationDto.Latitude,
                    Longitude = updateLocationDto.Longitude,
                    Timestamp = DateTime.UtcNow
                };
                _context.DriverLocations.Add(driverLocation);
            }
            else
            {
                driverLocation.Latitude = updateLocationDto.Latitude;
                driverLocation.Longitude = updateLocationDto.Longitude;
                driverLocation.Timestamp = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("{driverId}/location")]
        [Authorize(Roles = "Admin,Customer")]
        public async Task<IActionResult> GetDriverLocation(long driverId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !long.TryParse(userIdClaim.Value, out long userId))
            {
                return Unauthorized();
            }

            if (User.IsInRole("Customer"))
            {
                var isAllowed = await _context.Orders.AnyAsync(o => o.CustomerId == userId && o.DriverId == driverId);
                if (!isAllowed)
                {
                    return Forbid();
                }
            }

            var driverLocation = await _context.DriverLocations
                .Where(dl => dl.DriverId == driverId)
                .OrderByDescending(dl => dl.Timestamp)
                .FirstOrDefaultAsync();

            if (driverLocation == null)
            {
                return NotFound();
            }

            return Ok(new Core.DTOs.DriverLocationDto
            {
                Latitude = driverLocation.Latitude,
                Longitude = driverLocation.Longitude,
                Timestamp = driverLocation.Timestamp
            });
        }
    }
}
