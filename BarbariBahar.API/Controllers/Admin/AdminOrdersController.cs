// Content of Controllers/Admin/AdminOrdersController.cs
using BarbariBahar.API.Data;
using BarbariBahar.API.Core.DTOs.Admin;
using BarbariBahar.API.Core.DTOs.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public AdminOrdersController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(long id)
        {
            var order = await _context.Orders.Include(o => o.Customer).FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return NotFound();

            var dto = new OrderDetailDto
            {
                // ...
                Customer = order.Customer != null ? new CustomerInfoDto { FullName = $"{order.Customer.FirstName} {order.Customer.LastName}", Mobile = order.Customer.Mobile } : null,
                // ...
            };
            return Ok(dto);
        }
    }
}
