using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BarbariBahar.API.Data;
using BarbariBahar.API.Data.Entities;

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

        // GET: api/PackagingProductCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PackagingProductCategory>>> GetPackagingProductCategories()
        {
            return await _context.PackagingProductCategories.ToListAsync();
        }

        // GET: api/PackagingProductCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PackagingProductCategory>> GetPackagingProductCategory(int id)
        {
            var packagingProductCategory = await _context.PackagingProductCategories.FindAsync(id);

            if (packagingProductCategory == null)
            {
                return NotFound();
            }

            return packagingProductCategory;
        }

        // PUT: api/PackagingProductCategories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPackagingProductCategory(int id, PackagingProductCategory packagingProductCategory)
        {
            if (id != packagingProductCategory.Id)
            {
                return BadRequest();
            }

            _context.Entry(packagingProductCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PackagingProductCategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/PackagingProductCategories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PackagingProductCategory>> PostPackagingProductCategory(PackagingProductCategory packagingProductCategory)
        {
            _context.PackagingProductCategories.Add(packagingProductCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPackagingProductCategory", new { id = packagingProductCategory.Id }, packagingProductCategory);
        }

        // DELETE: api/PackagingProductCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePackagingProductCategory(int id)
        {
            // برای حذف، باید مطمئن شویم که هیچ محصولی به این دسته‌بندی لینک نشده است
            // بنابراین اطلاعات محصولات مرتبط را هم با Include بارگذاری می‌کنیم
            var packagingProductCategory = await _context.PackagingProductCategories
                                                            .Include(p => p.Products) // <--- این خط مهم است
                                                            .FirstOrDefaultAsync(p => p.Id == id);

            if (packagingProductCategory == null)
            {
                return NotFound();
            }

            // بررسی می‌کنیم آیا لیستی از محصولات برای این دسته‌بندی وجود دارد
            if (packagingProductCategory.Products.Any()) // <--- این خط مهم است
            {
                // اگر حتی یک محصول به این دسته‌بندی متصل باشد، اجازه حذف نمی‌دهیم
                return BadRequest("Cannot delete this category because it is associated with one or more products. Please remove or re-assign the products first.");
            }

            _context.PackagingProductCategories.Remove(packagingProductCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PackagingProductCategoryExists(int id)
        {
            return _context.PackagingProductCategories.Any(e => e.Id == id);
        }
    }
}
