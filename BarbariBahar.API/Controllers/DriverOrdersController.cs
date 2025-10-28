// Content of Controllers/DriverOrdersController.cs
using BarbariBahar.API.Data;
using BarbariBahar.API.Core.DTOs.Driver;
using BarbariBahar.API.Core.DTOs.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/driver/orders")]
    [Authorize(Roles = "Driver")]
    public class DriverOrdersController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public DriverOrdersController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(long id)
        {
            var driverId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var order = await _context.Orders.Include(o => o.Customer).FirstOrDefaultAsync(o => o.Id == id && o.DriverId == driverId);
            if (order == null) return NotFound();

            var dto = new DriverOrderDetailDto
            {
                // ...
                Customer = order.Customer != null ? new CustomerInfoDto { FullName = $"{order.Customer.FirstName} {order.Customer.LastName}", Mobile = order.Customer.Mobile } : null,
                // ...
            };
            return Ok(dto);
        }
    }
}
