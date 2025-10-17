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
    public class PackagingProductsController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public PackagingProductsController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        // GET: api/PackagingProducts
        // بهبود داده شده تا اطلاعات دسته‌بندی را هم شامل شود
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PackagingProduct>>> GetPackagingProducts()
        {
            // از Include استفاده می‌کنیم تا اطلاعات مرتبط از جدول Category را هم بارگذاری کنیم
            return await _context.PackagingProducts
                                 .Include(p => p.Category)
                                 .ToListAsync();
        }

        // GET: api/PackagingProducts/5
        // بهبود داده شده تا اطلاعات دسته‌بندی را هم شامل شود
        [HttpGet("{id}")]
        public async Task<ActionResult<PackagingProduct>> GetPackagingProduct(int id)
        {
            // اینجا هم از Include استفاده می‌کنیم
            var packagingProduct = await _context.PackagingProducts
                                                   .Include(p => p.Category)
                                                   .FirstOrDefaultAsync(p => p.Id == id);

            if (packagingProduct == null)
            {
                return NotFound();
            }

            return packagingProduct;
        }

        // PUT: api/PackagingProducts/5
        // بهبود داده شده برای اعتبارسنجی CategoryId
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPackagingProduct(int id, PackagingProduct packagingProduct)
        {
            if (id != packagingProduct.Id)
            {
                return BadRequest("Product ID in URL does not match Product ID in body.");
            }

            // بررسی می‌کنیم که آیا دسته‌بندی ارسال شده معتبر است یا خیر
            var categoryExists = await _context.PackagingProductCategories.AnyAsync(c => c.Id == packagingProduct.CategoryId);
            if (!categoryExists)
            {
                // اگر دسته‌بندی وجود نداشت، یک خطای واضح برمی‌گردانیم
                return BadRequest($"Category with Id '{packagingProduct.CategoryId}' does not exist.");
            }

            _context.Entry(packagingProduct).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PackagingProductExists(id))
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

        // POST: api/PackagingProducts
        // بهبود داده شده برای اعتبارسنجی CategoryId
        [HttpPost]
        public async Task<ActionResult<PackagingProduct>> PostPackagingProduct(PackagingProduct packagingProduct)
        {
            // بررسی می‌کنیم که آیا دسته‌بندی ارسال شده معتبر است یا خیر
            var categoryExists = await _context.PackagingProductCategories.AnyAsync(c => c.Id == packagingProduct.CategoryId);
            if (!categoryExists)
            {
                // اگر دسته‌بندی وجود نداشت، یک خطای واضح برمی‌گردانیم
                return BadRequest($"Category with Id '{packagingProduct.CategoryId}' does not exist.");
            }

            _context.PackagingProducts.Add(packagingProduct);
            await _context.SaveChangesAsync();

            // بعد از ذخیره، محصول را با اطلاعات دسته‌بندی کامل بارگذاری می‌کنیم تا در پاسخ برگردانیم
            await _context.Entry(packagingProduct).Reference(p => p.Category).LoadAsync();

            return CreatedAtAction("GetPackagingProduct", new { id = packagingProduct.Id }, packagingProduct);
        }

        // DELETE: api/PackagingProducts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePackagingProduct(int id)
        {
            var packagingProduct = await _context.PackagingProducts.FindAsync(id);
            if (packagingProduct == null)
            {
                return NotFound();
            }

            _context.PackagingProducts.Remove(packagingProduct);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PackagingProductExists(int id)
        {
            return _context.PackagingProducts.Any(e => e.Id == id);
        }
    }
}
