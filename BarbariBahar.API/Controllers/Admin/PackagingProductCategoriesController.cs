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
    public class PackagingProductCategoriesController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public PackagingProductCategoriesController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/packagingproductcategories
        [HttpGet]
        public async Task<IActionResult> GetPackagingProductCategories()
        {
            var categories = await _context.PackagingProductCategories
                .Select(c => new { c.Id, c.Name })
                .ToListAsync();
            return Ok(categories);
        }

        // GET: api/admin/packagingproductcategories/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPackagingProductCategory(int id)
        {
            var category = await _context.PackagingProductCategories.FindAsync(id);

            if (category == null)
            {
                return NotFound(new { message = "دسته بندی محصول یافت نشد." });
            }

            return Ok(new { category.Id, category.Name });
        }

        // POST: api/admin/packagingproductcategories
        [HttpPost]
        public async Task<IActionResult> CreatePackagingProductCategory([FromBody] BarbariBahar.API.Core.DTOs.Admin.PackagingProductCategoryDto categoryDto)
        {
            var newCategory = new PackagingProductCategory
            {
                Name = categoryDto.Name
            };

            _context.PackagingProductCategories.Add(newCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPackagingProductCategory), new { id = newCategory.Id }, new { newCategory.Id, newCategory.Name });
        }

        // PUT: api/admin/packagingproductcategories/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePackagingProductCategory(int id, [FromBody] BarbariBahar.API.Core.DTOs.Admin.PackagingProductCategoryDto categoryDto)
        {
            var category = await _context.PackagingProductCategories.FindAsync(id);

            if (category == null)
            {
                return NotFound(new { message = "دسته بندی محصول یافت نشد." });
            }

            category.Name = categoryDto.Name;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/admin/packagingproductcategories/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePackagingProductCategory(int id)
        {
            var category = await _context.PackagingProductCategories.FindAsync(id);

            if (category == null)
            {
                return NotFound(new { message = "دسته بندی محصول یافت نشد." });
            }

            var isCategoryInUse = await _context.PackagingProducts.AnyAsync(p => p.CategoryId == id);
            if (isCategoryInUse)
            {
                return BadRequest(new { message = "این دسته بندی در حال استفاده است و قابل حذف نیست." });
            }

            _context.PackagingProductCategories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
