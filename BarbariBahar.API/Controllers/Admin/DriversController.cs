using BarbariBahar.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BarbariBahar.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public class DriversController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public DriversController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        // Endpoints will be added here

        // GET: api/admin/drivers
        [HttpGet]
        public async Task<IActionResult> GetDrivers([FromQuery] BarbariBahar.API.Data.Enums.DriverStatus? status)
        {
            var query = _context.Drivers.AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(d => d.Status == status.Value);
            }

            var drivers = await query
                .Select(d => new BarbariBahar.API.Core.DTOs.Admin.DriverSummaryDto
                {
                    Id = d.Id,
                    FirstName = d.FirstName,
                    LastName = d.LastName,
                    Mobile = d.Mobile,
                    CarModel = d.CarModel,
                    CarPlateNumber = d.CarPlateNumber,
                    Status = d.Status
                })
                .ToListAsync();

            return Ok(drivers);
        }

        // GET: api/admin/drivers/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDriver(long id)
        {
            var driver = await _context.Drivers
                .Select(d => new BarbariBahar.API.Core.DTOs.Admin.DriverDetailsDto
                {
                    Id = d.Id,
                    FirstName = d.FirstName,
                    LastName = d.LastName,
                    Mobile = d.Mobile,
                    IsActive = d.IsActive,
                    CreatedAt = d.CreatedAt,
                    NationalCode = d.NationalCode,
                    ProfilePictureUrl = d.ProfilePictureUrl,
                    WorkerCount = d.WorkerCount,
                    CarModel = d.CarModel,
                    CarPlateNumber = d.CarPlateNumber,
                    Status = d.Status
                })
                .FirstOrDefaultAsync(d => d.Id == id);

            if (driver == null)
            {
                return NotFound(new { message = "راننده مورد نظر یافت نشد." });
            }

            return Ok(driver);
        }

        // PUT: api/admin/drivers/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDriver(long id, [FromBody] BarbariBahar.API.Core.DTOs.Admin.UpdateDriverDto updateDto)
        {
            var driver = await _context.Drivers.FindAsync(id);

            if (driver == null)
            {
                return NotFound(new { message = "راننده مورد نظر یافت نشد." });
            }

            driver.FirstName = updateDto.FirstName;
            driver.LastName = updateDto.LastName;
            driver.NationalCode = updateDto.NationalCode;
            driver.ProfilePictureUrl = updateDto.ProfilePictureUrl;
            driver.WorkerCount = updateDto.WorkerCount;
            driver.CarModel = updateDto.CarModel;
            driver.CarPlateNumber = updateDto.CarPlateNumber;

            await _context.SaveChangesAsync();

            return NoContent(); // 204 No Content is a standard response for a successful PUT
        }

        // PATCH: api/admin/drivers/{id}/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateDriverStatus(long id, [FromBody] BarbariBahar.API.Core.DTOs.Admin.UpdateDriverStatusDto statusDto)
        {
            var driver = await _context.Drivers.FindAsync(id);

            if (driver == null)
            {
                return NotFound(new { message = "راننده مورد نظر یافت نشد." });
            }

            driver.Status = statusDto.Status;
            driver.IsActive = statusDto.Status == BarbariBahar.API.Data.Enums.DriverStatus.Active;

            await _context.SaveChangesAsync();

            return Ok(new { message = "وضعیت راننده با موفقیت به‌روزرسانی شد." });
        }
    }
}
