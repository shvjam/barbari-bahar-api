using BarbariBahar.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TicketsController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;

        public TicketsController(BarbariBaharDbContext context)
        {
            _context = context;
        }

        // POST: api/tickets
        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody] BarbariBahar.API.Core.DTOs.Ticket.CreateTicketDto createTicketDto)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!long.TryParse(userIdStr, out var userId))
            {
                return Unauthorized();
            }

            // Optional: Validate that the order belongs to the user, unless the user is an admin
            if (createTicketDto.OrderId.HasValue && !User.IsInRole("Admin"))
            {
                var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == createTicketDto.OrderId.Value && o.CustomerId == userId);
                if (order == null)
                {
                    // Maybe it's a driver's order?
                    var driverOrder = await _context.Orders.FirstOrDefaultAsync(o => o.Id == createTicketDto.OrderId.Value && o.DriverId == userId);
                    if (driverOrder == null)
                    {
                        return Forbid(); // User does not own this order
                    }
                }
            }

            var ticket = new BarbariBahar.API.Data.Entities.Ticket
            {
                Subject = createTicketDto.Subject,
                UserId = userId,
                OrderId = createTicketDto.OrderId,
                Status = BarbariBahar.API.Data.Entities.TicketStatus.Open,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync(); // Save to get the TicketId

            var message = new BarbariBahar.API.Data.Entities.TicketMessage
            {
                TicketId = ticket.Id,
                SenderId = userId,
                Message = createTicketDto.Message,
                SentAt = DateTime.UtcNow
            };

            _context.TicketMessages.Add(message);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTicket), new { id = ticket.Id }, new { ticket.Id });
        }

        // GET: api/tickets
        [HttpGet]
        public async Task<IActionResult> GetTickets()
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!long.TryParse(userIdStr, out var userId))
            {
                return Unauthorized();
            }

            var query = _context.Tickets.AsQueryable();

            if (!User.IsInRole("Admin"))
            {
                query = query.Where(t => t.UserId == userId);
            }

            var tickets = await query
                .OrderByDescending(t => t.LastUpdatedAt ?? t.CreatedAt)
                .Select(t => new BarbariBahar.API.Core.DTOs.Ticket.TicketSummaryDto
                {
                    Id = (int)t.Id,
                    Subject = t.Subject,
                    Status = t.Status.ToString(),
                    LastUpdatedAt = t.LastUpdatedAt ?? t.CreatedAt
                })
                .ToListAsync();

            return Ok(tickets);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicket(long id)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!long.TryParse(userIdStr, out var userId))
            {
                return Unauthorized();
            }

            var ticket = await _context.Tickets
                .Include(t => _context.TicketMessages.Where(tm => tm.TicketId == id).Include(tm => tm.Sender))
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null)
            {
                return NotFound();
            }

            // Security check: User must be the owner of the ticket or an admin
            if (ticket.UserId != userId && !User.IsInRole("Admin"))
            {
                return Forbid();
            }

            var ticketDetail = new BarbariBahar.API.Core.DTOs.Ticket.TicketDetailDto
            {
                Id = (int)ticket.Id,
                Subject = ticket.Subject,
                Status = ticket.Status.ToString(),
                OrderId = ticket.OrderId,
                CreatedAt = ticket.CreatedAt,
                Messages = _context.TicketMessages.Where(tm => tm.TicketId == id).Select(m => new BarbariBahar.API.Core.DTOs.Ticket.TicketMessageDto
                {
                    SenderName = m.Sender.FirstName + " " + m.Sender.LastName,
                    Message = m.Message,
                    SentAt = m.SentAt
                }).ToList()
            };

            return Ok(ticketDetail);
        }

        // POST: api/tickets/{id}/reply
        [HttpPost("{id}/reply")]
        public async Task<IActionResult> ReplyToTicket(long id, [FromBody] BarbariBahar.API.Core.DTOs.Ticket.ReplyToTicketDto replyDto)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!long.TryParse(userIdStr, out var userId))
            {
                return Unauthorized();
            }

            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            // Security check: User must be the owner of the ticket or an admin
            if (ticket.UserId != userId && !User.IsInRole("Admin"))
            {
                return Forbid();
            }

            var message = new BarbariBahar.API.Data.Entities.TicketMessage
            {
                TicketId = id,
                SenderId = userId,
                Message = replyDto.Message,
                SentAt = DateTime.UtcNow
            };

            _context.TicketMessages.Add(message);

            // Update ticket status
            ticket.LastUpdatedAt = DateTime.UtcNow;
            if (User.IsInRole("Admin"))
            {
                ticket.Status = BarbariBahar.API.Data.Entities.TicketStatus.InProgress;
            }
            else
            {
                ticket.Status = BarbariBahar.API.Data.Entities.TicketStatus.Open;
            }

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
