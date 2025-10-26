using BarbariBahar.API.Data;
using BarbariBahar.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
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

        [HttpGet("packaging/{id}")]
        public async Task<IActionResult> GetPackagingProduct(int id)
        {
            var product = await _context.PackagingProducts.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        [HttpPost("packaging")]
        public async Task<IActionResult> CreatePackagingProduct([FromBody] BarbariBahar.API.Core.DTOs.Product.CreatePackagingProductDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newProduct = new BarbariBahar.API.Data.Entities.PackagingProduct
            {
                Name = createDto.Name,
                Price = createDto.Price,
                Description = createDto.Description,
                CategoryId = createDto.CategoryId,
                IsAvailable = true // Default to available on creation
            };

            _context.PackagingProducts.Add(newProduct);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPackagingProduct), new { id = newProduct.Id }, newProduct);
        }

        [HttpPut("packaging/{id}")]
        public async Task<IActionResult> UpdatePackagingProduct(int id, [FromBody] BarbariBahar.API.Core.DTOs.Product.UpdatePackagingProductDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var productFromDb = await _context.PackagingProducts.FindAsync(id);

            if (productFromDb == null)
            {
                return NotFound();
            }

            productFromDb.Name = updateDto.Name;
            productFromDb.Price = updateDto.Price;
            productFromDb.Description = updateDto.Description;
            productFromDb.CategoryId = updateDto.CategoryId;
            productFromDb.IsAvailable = updateDto.IsAvailable;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("packaging/{id}")]
        public async Task<IActionResult> DeletePackagingProduct(int id)
        {
            var product = await _context.PackagingProducts.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.PackagingProducts.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
