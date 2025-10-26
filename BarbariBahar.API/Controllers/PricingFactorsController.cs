using BarbariBahar.API.Core.Dtos.PricingFactor;
using BarbariBahar.API.Core.DTOs.PricingFactor;
using BarbariBahar.API.Data; // مسیر DbContext شما
using BarbariBahar.API.Data.Entities; // مسیر مدل‌های شما
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BarbariBahar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // آدرس این کنترلر می شود: /api/pricingfactors
    [Authorize(Roles = "Admin")]
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
        public async Task<ActionResult<IEnumerable<PricingFactorDto>>> GetPricingFactors()
        {
            var factors = await _context.PricingFactors
                .Select(p => new PricingFactorDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    Unit = p.Unit,
                    Category = p.Category, // مستقیم انتساب میدهیم
                    IsActive = p.IsActive
                })
                .ToListAsync();

            return Ok(factors);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<PricingFactorDto>> GetPricingFactor(int id)
        {
            var factor = await _context.PricingFactors.FindAsync(id);

            if (factor == null)
            {
                return NotFound();
            }

            var factorDto = new PricingFactorDto
            {
                Id = factor.Id,
                Name = factor.Name,
                Price = factor.Price,
                Unit = factor.Unit,
                Category = factor.Category,
                IsActive = factor.IsActive
            };

            return Ok(factorDto);
        }

        [HttpPost]
        public async Task<ActionResult<PricingFactorDto>> CreatePricingFactor([FromBody] CreatePricingFactorDto createDto)
        {
            // دیگر نیازی به TryParse نیست!
            var newFactor = new PricingFactor
            {
                Name = createDto.Name,
                Price = createDto.Price,
                Unit = createDto.Unit,
                Category = createDto.Category, // مستقیم انتساب میدهیم
                IsActive = createDto.IsActive
            };

            _context.PricingFactors.Add(newFactor);
            await _context.SaveChangesAsync();

            var factorToReturn = new PricingFactorDto
            {
                Id = newFactor.Id,
                Name = newFactor.Name,
                Price = newFactor.Price,
                Unit = newFactor.Unit,
                Category = newFactor.Category, // مستقیم انتساب میدهیم
                IsActive = newFactor.IsActive
            };

            return CreatedAtAction(nameof(GetPricingFactor), new { id = newFactor.Id }, factorToReturn);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePricingFactor(int id, [FromBody] UpdatePricingFactorDto updateDto)
        {
            var factorFromDb = await _context.PricingFactors.FindAsync(id);

            if (factorFromDb == null)
            {
                return NotFound();
            }

            factorFromDb.Name = updateDto.Name;
            factorFromDb.Price = updateDto.Price;
            factorFromDb.Unit = updateDto.Unit;
            factorFromDb.Category = updateDto.Category; // مستقیم انتساب میدهیم
            factorFromDb.IsActive = updateDto.IsActive;

            // ... بقیه کد بدون تغییر

            await _context.SaveChangesAsync();
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
