using BarbariBahar.API.Core.DTOs.PricingFactor;
using BarbariBahar.API.Data;
using BarbariBahar.API.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class PricingFactorsController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public PricingFactorsController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PricingFactorDto>>> GetPricingFactors([FromQuery] int? serviceCategoryId)
        {
            var query = _context.PricingFactors.AsQueryable();

            if (serviceCategoryId.HasValue)
            {
                query = query.Where(p => p.ServiceCategoryId == serviceCategoryId.Value);
            }

            var factors = await query
                .Include(p => p.ServiceCategory) // Join with ServiceCategories
                .Select(p => new PricingFactorDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    Unit = p.Unit,
                    ServiceCategoryId = p.ServiceCategoryId,
                    ServiceCategoryName = p.ServiceCategory.Name, // Get the name from the joined table
                    IsActive = p.IsActive
                })
                .ToListAsync();

            return Ok(factors);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PricingFactorDto>> GetPricingFactor(int id)
        {
            var factor = await _context.PricingFactors
                .Include(p => p.ServiceCategory)
                .FirstOrDefaultAsync(p => p.Id == id);

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
                ServiceCategoryId = factor.ServiceCategoryId,
                ServiceCategoryName = factor.ServiceCategory.Name,
                IsActive = factor.IsActive
            };

            return Ok(factorDto);
        }

        [HttpPost]
        public async Task<ActionResult<PricingFactorDto>> CreatePricingFactor([FromBody] CreatePricingFactorDto createDto)
        {
            var serviceCategory = await _context.ServiceCategories.FindAsync(createDto.ServiceCategoryId);
            if (serviceCategory == null)
            {
                return BadRequest(new { message = "دسته بندی انتخاب شده معتبر نیست." });
            }

            var newFactor = new PricingFactor
            {
                Name = createDto.Name,
                Price = createDto.Price,
                Unit = createDto.Unit,
                ServiceCategoryId = createDto.ServiceCategoryId,
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
                ServiceCategoryId = newFactor.ServiceCategoryId,
                ServiceCategoryName = serviceCategory.Name,
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

            var serviceCategory = await _context.ServiceCategories.FindAsync(updateDto.ServiceCategoryId);
            if (serviceCategory == null)
            {
                return BadRequest(new { message = "دسته بندی انتخاب شده معتبر نیست." });
            }

            factorFromDb.Name = updateDto.Name;
            factorFromDb.Price = updateDto.Price;
            factorFromDb.Unit = updateDto.Unit;
            factorFromDb.ServiceCategoryId = updateDto.ServiceCategoryId;
            factorFromDb.IsActive = updateDto.IsActive;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePricingFactor(int id)
        {
            var pricingFactor = await _context.PricingFactors.FindAsync(id);
            if (pricingFactor == null)
            {
                return NotFound();
            }

            _context.PricingFactors.Remove(pricingFactor);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
