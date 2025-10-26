using BarbariBahar.API.Data;
using BarbariBahar.API.Data.Entities;
using BarbariBahar.API.Core.DTOs.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;

namespace BarbariBahar.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public class ServiceCategoriesController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public ServiceCategoriesController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/servicecategories
        [HttpGet]
        public async Task<IActionResult> GetServiceCategories()
        {
            var categories = await _context.ServiceCategories
                .Select(c => new { c.Id, c.Name }) // Returning anonymous type for simplicity
                .ToListAsync();
            return Ok(categories);
        }

        // GET: api/admin/servicecategories/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetServiceCategory(int id)
        {
            var category = await _context.ServiceCategories.FindAsync(id);

            if (category == null)
            {
                return NotFound(new { message = "دسته بندی مورد نظر یافت نشد." });
            }

            return Ok(new { category.Id, category.Name });
        }

        // POST: api/admin/servicecategories
        [HttpPost]
        public async Task<IActionResult> CreateServiceCategory([FromBody] ServiceCategoryDto categoryDto)
        {
            var newCategory = new ServiceCategory
            {
                Name = categoryDto.Name
            };

            _context.ServiceCategories.Add(newCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetServiceCategory), new { id = newCategory.Id }, new { newCategory.Id, newCategory.Name });
        }

        // PUT: api/admin/servicecategories/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateServiceCategory(int id, [FromBody] ServiceCategoryDto categoryDto)
        {
            var category = await _context.ServiceCategories.FindAsync(id);

            if (category == null)
            {
                return NotFound(new { message = "دسته بندی مورد نظر یافت نشد." });
            }

            category.Name = categoryDto.Name;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/admin/servicecategories/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServiceCategory(int id)
        {
            var category = await _context.ServiceCategories.FindAsync(id);

            if (category == null)
            {
                return NotFound(new { message = "دسته بندی مورد نظر یافت نشد." });
            }

            // Optional: Check if any PricingFactor is using this category before deleting
            var isCategoryInUse = await _context.PricingFactors.AnyAsync(p => p.ServiceCategoryId == id);
            if (isCategoryInUse)
            {
                return BadRequest(new { message = "این دسته بندی در حال استفاده است و قابل حذف نیست." });
            }

            _context.ServiceCategories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
