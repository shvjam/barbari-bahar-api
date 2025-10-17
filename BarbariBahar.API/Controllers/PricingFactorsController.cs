using BarbariBahar.API.Data; // مسیر DbContext شما
using BarbariBahar.API.Data.Entities; // مسیر مدل‌های شما
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BarbariBahar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // آدرس این کنترلر می شود: /api/pricingfactors
    public class PricingFactorsController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        // سازنده (Constructor) برای تزریق وابستگی DbContext
        public PricingFactorsController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        // اینجا Endpoints را یکی یکی اضافه خواهیم کرد
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PricingFactor>>> GetPricingFactors()
        {
            // از دیتابیس، تمام رکوردهای جدول PricingFactors را بخوان
            var factors = await _context.PricingFactors.ToListAsync();

            // نتیجه را با کد وضعیت 200 OK برگردان
            return Ok(factors);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<PricingFactor>> GetPricingFactor(int id)
        {
            // به دنبال یک عامل قیمت‌گذاری با Id مشخص شده بگرد
            var pricingFactor = await _context.PricingFactors.FindAsync(id);

            // اگر هیچ عاملی با این Id پیدا نشد
            if (pricingFactor == null)
            {
                // یک پاسخ 404 Not Found برگردان
                return NotFound();
            }

            // اگر پیدا شد، آن را با کد وضعیت 200 OK برگردان
            return Ok(pricingFactor);
        }
        [HttpPost]
        public async Task<ActionResult<PricingFactor>> PostPricingFactor(PricingFactor pricingFactor)
        {
            // داده‌های ارسال شده را به مجموعه PricingFactors در DbContext اضافه کن
            _context.PricingFactors.Add(pricingFactor);

            // تغییرات را در دیتابیس واقعی ذخیره کن
            await _context.SaveChangesAsync();

            // پس از ایجاد موفقیت‌آمیز، آیتم ایجاد شده را به همراه کد وضعیت 201 Created برگردان
            // همچنین آدرس دسترسی به آیتم جدید را در هدر 'Location' پاسخ قرار بده
            return CreatedAtAction(nameof(GetPricingFactor), new { id = pricingFactor.Id }, pricingFactor);
        }
        private bool PricingFactorExists(int id)
        {
            return _context.PricingFactors.Any(e => e.Id == id);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPricingFactor(int id, PricingFactor pricingFactor)
        {
            // بررسی اینکه آیا Id موجود در URL با Id موجود در بدنه درخواست یکی است یا خیر
            if (id != pricingFactor.Id)
            {
                // اگر یکی نیست، یک درخواست بد (Bad Request) است
                return BadRequest("ID in URL does not match ID in body.");
            }

            // به Entity Framework بگو که وضعیت این آبجکت "تغییر یافته" (Modified) است
            _context.Entry(pricingFactor).State = EntityState.Modified;

            try
            {
                // سعی کن تغییرات را در دیتابیس ذخیره کنی
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // این خطا زمانی رخ می‌دهد که آیتم مورد نظر برای ویرایش،
                // همزمان توسط شخص دیگری حذف شده باشد.
                if (!PricingFactorExists(id))
                {
                    // اگر آیتم دیگر وجود ندارد، خطای 404 برگردان
                    return NotFound();
                }
                else
                {
                    // اگر دلیل دیگری داشت، خطا را دوباره پرتاب کن
                    throw;
                }
            }

            // در صورت موفقیت، کد 204 No Content را برگردان.
            // این کد استاندارد برای پاسخ به یک درخواست PUT موفق است که بدنه پاسخی ندارد.
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePricingFactor(int id)
        {
            // ابتدا آیتم مورد نظر برای حذف را پیدا کن
            var pricingFactor = await _context.PricingFactors.FindAsync(id);
            if (pricingFactor == null)
            {
                // اگر پیدا نشد، خطای 404 برگردان
                return NotFound();
            }

            // به Entity Framework بگو که این آیتم باید حذف شود
            _context.PricingFactors.Remove(pricingFactor);
            // تغییرات را در دیتابیس ذخیره کن
            await _context.SaveChangesAsync();

            // در صورت موفقیت، کد 204 No Content را برگردان
            return NoContent();
        }
    }
}
