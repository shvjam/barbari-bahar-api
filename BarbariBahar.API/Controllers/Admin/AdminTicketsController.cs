using BarbariBahar.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace BarbariBahar.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/tickets")]
    [Authorize(Roles = "Admin")]
    public class AdminTicketsController : ControllerBase
    {
        private readonly BarbariBaharDbContext _context;
        private readonly Microsoft.AspNetCore.SignalR.IHubContext<BarbariBahar.API.Hubs.NotificationHub> _notificationHubContext;

        public AdminTicketsController(BarbariBaharDbContext context, Microsoft.AspNetCore.SignalR.IHubContext<BarbariBahar.API.Hubs.NotificationHub> notificationHubContext)
        {
            _context = context;
            _notificationHubContext = notificationHubContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetTickets()
        {
            var tickets = await _context.Tickets
                .Include(t => t.User)
                .Select(t => new Core.DTOs.Admin.TicketSummaryDto
                {
                    Id = t.Id,
                    Subject = t.Subject,
                    UserName = t.User.FirstName + " " + t.User.LastName,
                    Status = t.Status.ToString(),
                    Priority = t.Priority.ToString(),
                    LastUpdate = t.LastUpdatedAt ?? t.CreatedAt
                })
                .ToListAsync();

            return Ok(tickets);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicketById(long id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.TicketMessages)
                .ThenInclude(tm => tm.Sender)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null)
            {
                return NotFound();
            }

            var ticketDetail = new Core.DTOs.Admin.TicketDetailDto
            {
                Id = ticket.Id,
                Subject = ticket.Subject,
                UserName = ticket.User.FirstName + " " + ticket.User.LastName,
                Status = ticket.Status.ToString(),
                Priority = ticket.Priority.ToString(),
                CreatedAt = ticket.CreatedAt,
                Messages = ticket.TicketMessages.Select(tm => new Core.DTOs.Admin.TicketMessageDto
                {
                    Id = tm.Id,
                    SenderName = tm.Sender.FirstName + " " + tm.Sender.LastName,
                    Message = tm.Message,
                    SentAt = tm.SentAt,
                    IsFromAdmin = tm.Sender is Data.Entities.Admin
                }).ToList()
            };

            return Ok(ticketDetail);
        }
        [HttpPost("{id}/reply")]
        public async Task<IActionResult> ReplyToTicket(long id, [FromBody] Core.DTOs.Admin.ReplyToTicketDto replyDto)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound();
            }

            var adminId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            var message = new Data.Entities.TicketMessage
            {
                TicketId = id,
                SenderId = long.Parse(adminId),
                Message = replyDto.Message,
                SentAt = DateTime.UtcNow
            };

            _context.TicketMessages.Add(message);

            ticket.Status = Data.Entities.TicketStatus.WaitingForCustomer;
            ticket.LastUpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var connectionId = BarbariBahar.API.Hubs.NotificationHub.GetConnectionId(ticket.UserId.ToString());
            if (connectionId != null)
            {
                await _notificationHubContext.Clients.Client(connectionId).SendAsync("NewTicketReply", new { ticketId = ticket.Id });
            }

            return Ok();
        }
    }
}
