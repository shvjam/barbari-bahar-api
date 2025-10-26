using BarbariBahar.API.Data;
using BarbariBahar.API.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public class PricingFactorsController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public PricingFactorsController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/pricingfactors
        [HttpGet]
        public async Task<IActionResult> GetPricingFactors()
        {
            var factors = await _context.PricingFactors
                .Include(p => p.ServiceCategory)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.Unit,
                    p.IsActive,
                    ServiceCategory = p.ServiceCategory.Name
                })
                .ToListAsync();
            return Ok(factors);
        }

        // GET: api/admin/pricingfactors/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPricingFactor(int id)
        {
            var factor = await _context.PricingFactors
                .Include(p => p.ServiceCategory)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.Unit,
                    p.IsActive,
                    p.ServiceCategoryId,
                    ServiceCategory = p.ServiceCategory.Name
                })
                .FirstOrDefaultAsync(p => p.Id == id);

            if (factor == null)
            {
                return NotFound(new { message = "آیتم قیمت گذاری یافت نشد." });
            }

            return Ok(factor);
        }

        // POST: api/admin/pricingfactors
        [HttpPost]
        public async Task<IActionResult> CreatePricingFactor([FromBody] BarbariBahar.API.Core.DTOs.Admin.PricingFactorDto factorDto)
        {
            var newFactor = new PricingFactor
            {
                Name = factorDto.Name,
                Description = factorDto.Description,
                Price = factorDto.Price,
                Unit = factorDto.Unit,
                ServiceCategoryId = factorDto.ServiceCategoryId,
                IsActive = factorDto.IsActive
            };

            _context.PricingFactors.Add(newFactor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPricingFactor), new { id = newFactor.Id }, newFactor);
        }

        // PUT: api/admin/pricingfactors/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePricingFactor(int id, [FromBody] BarbariBahar.API.Core.DTOs.Admin.PricingFactorDto factorDto)
        {
            var factor = await _context.PricingFactors.FindAsync(id);

            if (factor == null)
            {
                return NotFound(new { message = "آیتم قیمت گذاری یافت نشد." });
            }

            factor.Name = factorDto.Name;
            factor.Description = factorDto.Description;
            factor.Price = factorDto.Price;
            factor.Unit = factorDto.Unit;
            factor.ServiceCategoryId = factorDto.ServiceCategoryId;
            factor.IsActive = factorDto.IsActive;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/admin/pricingfactors/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePricingFactor(int id)
        {
            var factor = await _context.PricingFactors.FindAsync(id);

            if (factor == null)
            {
                return NotFound(new { message = "آیتم قیمت گذاری یافت نشد." });
            }

            _context.PricingFactors.Remove(factor);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
