using BarbariBahar.API.Data;
using BarbariBahar.API.Data.Entities;
using BarbariBahar.Core.DTOs.Product;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;                       // <<--- این خط هم برای کار با فایل‌ها (Path, File, Directory) لازم است
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PackagingProductsController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment; // <-- این خط را اضافه کن


        public PackagingProductsController(BarbariBaharDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
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
        public async Task<ActionResult<PackagingProduct>> PostPackagingProduct([FromForm] CreatePackagingProductDto createDto)
        {
            // اینجا چون از ApiController استفاده می‌کنیم، ModelState.IsValid به صورت خودکار چک می‌شود
            // و در صورت نامعتبر بودن، BadRequest برمی‌گرداند.

            var category = await _context.PackagingProductCategories.FindAsync(createDto.CategoryId);
            if (category == null)
            {
                return BadRequest(new { message = "دسته بندی انتخاب شده نامعتبر است." });
            }

            var packagingProduct = new PackagingProduct
            {
                Name = createDto.Name,
                Description = createDto.Description,
                Price = createDto.Price,
                Stock = createDto.Stock,
                CategoryId = createDto.CategoryId
                // ImageUrl بعداً پر می‌شود
            };

            // بخش پردازش و ذخیره فایل
            if (createDto.ImageFile != null && createDto.ImageFile.Length > 0)
            {
                // ۱. ایجاد یک نام فایل منحصر به فرد
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(createDto.ImageFile.FileName);

                // ۲. مشخص کردن مسیر کامل ذخیره‌سازی روی سرور (پوشه wwwroot/Uploads)
                var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads");
                if (!Directory.Exists(uploadsFolderPath))
                {
                    Directory.CreateDirectory(uploadsFolderPath);
                }
                var filePath = Path.Combine(uploadsFolderPath, fileName);

                // ۳. کپی کردن فایل آپلود شده در مسیر مشخص شده
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await createDto.ImageFile.CopyToAsync(stream);
                }

                // ۴. تنظیم آدرس URL برای دسترسی از طریق وب
                packagingProduct.ImageUrl = $"/Uploads/{fileName}"; // آدرس برای دسترسی از وب
            }

            _context.PackagingProducts.Add(packagingProduct);
            await _context.SaveChangesAsync();

            // لود کردن اطلاعات دسته بندی برای نمایش در پاسخ
            await _context.Entry(packagingProduct).Reference(p => p.Category).LoadAsync();

            return CreatedAtAction(nameof(GetPackagingProduct), new { id = packagingProduct.Id }, packagingProduct);
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
        [HttpPatch("{id}/image")]
        public async Task<IActionResult> UpdateProductImage(int id, [FromForm] IFormFile imageFile)
        {
            // 1. بررسی ورودی
            if (imageFile == null || imageFile.Length == 0)
            {
                return BadRequest("فایل تصویر ارسال نشده است.");
            }

            // 2. پیدا کردن محصول مورد نظر
            var productToUpdate = await _context.PackagingProducts.FindAsync(id);
            if (productToUpdate == null)
            {
                return NotFound("محصول مورد نظر یافت نشد.");
            }

            // --- استفاده از IWebHostEnvironment برای مسیردهی صحیح ---
            var uploadsFolderPath = Path.Combine(_webHostEnvironment.WebRootPath, "Uploads");

            // 3. حذف عکس قدیمی (اگر وجود دارد)
            if (!string.IsNullOrEmpty(productToUpdate.ImageUrl))
            {
                // ImageUrl ما /Uploads/filename.jpg است. باید اسلش اول را حذف کنیم.
                var oldImageRelativePath = productToUpdate.ImageUrl.TrimStart('/');
                var oldImageFullPath = Path.Combine(_webHostEnvironment.WebRootPath, oldImageRelativePath);

                if (System.IO.File.Exists(oldImageFullPath))
                {
                    System.IO.File.Delete(oldImageFullPath);
                }
            }

            // اطمینان از وجود پوشه آپلود
            if (!Directory.Exists(uploadsFolderPath))
            {
                Directory.CreateDirectory(uploadsFolderPath);
            }

            // 4. ذخیره عکس جدید
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
            var newImageFullPath = Path.Combine(uploadsFolderPath, fileName);

            using (var stream = new FileStream(newImageFullPath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            // 5. آپدیت مسیر عکس در دیتابیس (با فرمت URL صحیح)
            productToUpdate.ImageUrl = $"/Uploads/{fileName}";

            _context.Entry(productToUpdate).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            // 6. بازگرداندن پاسخ موفقیت آمیز با آبجکت محصول آپدیت شده
            return Ok(productToUpdate);
        }
    }
}
