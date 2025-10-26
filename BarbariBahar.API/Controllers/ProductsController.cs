using BarbariBahar.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public ProductsController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        [HttpGet("packaging")]
        public async Task<IActionResult> GetPackagingProducts()
        {
            var products = await _context.PackagingProducts.ToListAsync();
            return Ok(products);
        }
    }
}
