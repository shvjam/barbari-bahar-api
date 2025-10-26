using BarbariBahar.API.Data;
using BarbariBahar.API.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public class PackagingProductsController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public PackagingProductsController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/packagingproducts
        [HttpGet]
        public async Task<IActionResult> GetPackagingProducts()
        {
            var products = await _context.PackagingProducts
                .Include(p => p.Category)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.Stock,
                    p.IsActive,
                    Category = p.Category.Name
                })
                .ToListAsync();
            return Ok(products);
        }

        // GET: api/admin/packagingproducts/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPackagingProduct(int id)
        {
            var product = await _context.PackagingProducts
                .Include(p => p.Category)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.ImageUrl,
                    p.Dimensions,
                    p.Stock,
                    p.Price,
                    p.IsActive,
                    p.IsAvailable,
                    p.CategoryId,
                    Category = p.Category.Name
                })
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound(new { message = "محصول مورد نظر یافت نشد." });
            }

            return Ok(product);
        }

        // POST: api/admin/packagingproducts
        [HttpPost]
        public async Task<IActionResult> CreatePackagingProduct([FromBody] BarbariBahar.API.Core.DTOs.Admin.PackagingProductDto productDto)
        {
            var newProduct = new PackagingProduct
            {
                Name = productDto.Name,
                Description = productDto.Description,
                ImageUrl = productDto.ImageUrl,
                Dimensions = productDto.Dimensions,
                Stock = productDto.Stock,
                Price = productDto.Price,
                IsActive = productDto.IsActive,
                IsAvailable = productDto.IsAvailable,
                CategoryId = productDto.CategoryId
            };

            _context.PackagingProducts.Add(newProduct);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPackagingProduct), new { id = newProduct.Id }, newProduct);
        }

        // PUT: api/admin/packagingproducts/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePackagingProduct(int id, [FromBody] BarbariBahar.API.Core.DTOs.Admin.PackagingProductDto productDto)
        {
            var product = await _context.PackagingProducts.FindAsync(id);

            if (product == null)
            {
                return NotFound(new { message = "محصول مورد نظر یافت نشد." });
            }

            product.Name = productDto.Name;
            product.Description = productDto.Description;
            product.ImageUrl = productDto.ImageUrl;
            product.Dimensions = productDto.Dimensions;
            product.Stock = productDto.Stock;
            product.Price = productDto.Price;
            product.IsActive = productDto.IsActive;
            product.IsAvailable = productDto.IsAvailable;
            product.CategoryId = productDto.CategoryId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/admin/packagingproducts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePackagingProduct(int id)
        {
            var product = await _context.PackagingProducts.FindAsync(id);

            if (product == null)
            {
                return NotFound(new { message = "محصول مورد نظر یافت نشد." });
            }

            _context.PackagingProducts.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
