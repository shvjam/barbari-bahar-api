using BarbariBahar.API.Data;
using BarbariBahar.API.Core.DTOs.Product;
using BarbariBahar.API.Data.Entities;
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

        // CRUD Endpoints will be added here
        [HttpGet]
        [AllowAnonymous] // Allow anonymous access to get products
        public async Task<IActionResult> GetPackagingProducts()
        {
            var products = await _context.PackagingProducts.ToListAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPackagingProduct(int id)
        {
            var product = await _context.PackagingProducts.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePackagingProduct([FromBody] CreatePackagingProductDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newProduct = new PackagingProduct
            {
                Name = createDto.Name,
                Price = createDto.Price,
                Description = createDto.Description,
                CategoryId = createDto.CategoryId,
                IsAvailable = true
            };

            _context.PackagingProducts.Add(newProduct);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPackagingProduct), new { id = newProduct.Id }, newProduct);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePackagingProduct(int id, [FromBody] UpdatePackagingProductDto updateDto)
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

        [HttpDelete("{id}")]
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

        [HttpPost("{id}/upload-image")]
        public async Task<IActionResult> UploadImage(int id, IFormFile file)
        {
            var product = await _context.PackagingProducts.FindAsync(id);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest("Upload a valid image.");
            }

            var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            if (!Directory.Exists(uploadsFolderPath))
            {
                Directory.CreateDirectory(uploadsFolderPath);
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            product.ImageUrl = $"/Uploads/{fileName}";
            await _context.SaveChangesAsync();

            return Ok(new { ImageUrl = product.ImageUrl });
        }
    }
}
