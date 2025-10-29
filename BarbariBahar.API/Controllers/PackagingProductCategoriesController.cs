using BarbariBahar.API.Data;
using BarbariBahar.API.Core.DTOs.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PackagingProductCategoriesController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public PackagingProductCategoriesController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.PackagingProductCategories
                .Select(c => new ProductCategoryDto
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .ToListAsync();

            return Ok(categories);
        }
    }
}
