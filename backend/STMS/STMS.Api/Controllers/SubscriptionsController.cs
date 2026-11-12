
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using STMS.Api.DTOs.Subscriptions;
using STMS.Core.Entities;
using STMS.Infrastructure.Data;
using System.Security.Claims;

namespace STMS.Api.Controllers
{
  [ApiController]
  [Route("api/subscriptions")]
  [Authorize]
  public class SubscriptionsController : ControllerBase
  {
    private readonly AppDbContext _context;

    // Temporary school semester dates
    private static readonly DateTime SemesterStart =
        new DateTime(2026, 9, 1);

    private static readonly DateTime SemesterEnd =
        new DateTime(2026, 12, 31);

    public SubscriptionsController(AppDbContext context)
    {
      _context = context;
    }

    // ============================================
    // PARENT ENDPOINTS
    // ============================================

    // GET: api/subscriptions
    [HttpGet]
    [Authorize(Roles = "Parent")]
    public async Task<IActionResult> GetMySubscriptions()
    {
      var parentId = await GetParentIdAsync();

      if (parentId == null)
        return Unauthorized(new
        {
          message = "Parent account not found or token is invalid."
        });

      var subscriptions = await _context.Subscriptions
          .AsNoTracking()
          .Where(s => s.Student.ParentId == parentId.Value)
          .OrderByDescending(s => s.RequestedAt)
          .Select(s => new
          {
            s.SubscriptionId,
            s.ReferenceNumber,
            s.StudentId,
            studentName = s.Student.FullName,
            s.RouteId,
            routeName = s.Route.Name,
            s.StopId,
            stopName = s.Stop.Name,
            s.TransportType,
            s.Fee,
            s.Status,
            s.StartDate,
            s.EndDate,
            s.RequestedAt
          })
          .ToListAsync();

      return Ok(subscriptions);
    }

    // GET: api/subscriptions/{id}
    [HttpGet("{id:int}")]
    [Authorize(Roles = "Parent")]
    public async Task<IActionResult> GetSubscription(int id)
    {
      var parentId = await GetParentIdAsync();

      if (parentId == null)
        return Unauthorized(new
        {
          message = "Parent account not found or token is invalid."
        });

      var subscription = await _context.Subscriptions
          .AsNoTracking()
          .Where(s =>
              s.SubscriptionId == id &&
              s.Student.ParentId == parentId.Value)
          .Select(s => new
          {
            s.SubscriptionId,
            s.ReferenceNumber,
            s.StudentId,
            studentName = s.Student.FullName,
            s.RouteId,
            routeName = s.Route.Name,
            s.StopId,
            stopName = s.Stop.Name,
            s.TransportType,
            s.Fee,
            s.Status,
            s.StartDate,
            s.EndDate,
            s.RequestedAt
          })
          .FirstOrDefaultAsync();

      if (subscription == null)
        return NotFound(new
        {
          message = "Subscription not found."
        });

      return Ok(subscription);
    }

    // POST: api/subscriptions
    [HttpPost]
    [Authorize(Roles = "Parent")]
    public async Task<IActionResult> CreateSubscription(
        [FromBody] CreateSubscriptionRequest request)
    {
      var parentId = await GetParentIdAsync();

      if (parentId == null)
        return Unauthorized(new
        {
          message = "Parent account not found or token is invalid."
        });

      if (request.StudentId <= 0 ||
          request.RouteId <= 0 ||
          request.StopId <= 0)
      {
        return BadRequest(new
        {
          message = "Valid student, route and stop IDs are required."
        });
      }

      if (request.TransportType != "OneWay" &&
          request.TransportType != "RoundTrip")
      {
        return BadRequest(new
        {
          message = "Transport type must be OneWay or RoundTrip."
        });
      }

      // Verify student ownership
      var studentExists = await _context.Students
          .AsNoTracking()
          .AnyAsync(s =>
              s.StudentId == request.StudentId &&
              s.ParentId == parentId.Value);

      if (!studentExists)
        return NotFound(new
        {
          message = "Student not found."
        });

      // Load route first to avoid Oracle boolean filtering issues
      var route = await _context.Routes
          .AsNoTracking()
          .FirstOrDefaultAsync(r =>
              r.RouteId == request.RouteId);

      if (route == null || !route.IsActive)
        return BadRequest(new
        {
          message = "Selected route is not available."
        });

      // Verify stop belongs to selected route
      var stopExists = await _context.Stops
          .AsNoTracking()
          .AnyAsync(s =>
              s.StopId == request.StopId &&
              s.RouteId == request.RouteId);

      if (!stopExists)
        return BadRequest(new
        {
          message = "Selected stop does not belong to the route."
        });

      // Prevent duplicate requests
      var hasExistingSubscription = await _context.Subscriptions
          .AsNoTracking()
          .AnyAsync(s =>
              s.StudentId == request.StudentId &&
              s.StartDate == SemesterStart &&
              s.EndDate == SemesterEnd &&
              (s.Status == "Pending" ||
               s.Status == "Approved"));

      if (hasExistingSubscription)
        return Conflict(new
        {
          message = "Student already has a subscription for this semester."
        });

      // Check available capacity
      var reservedSeats = await _context.Subscriptions
          .AsNoTracking()
          .CountAsync(s =>
              s.RouteId == request.RouteId &&
              s.StartDate == SemesterStart &&
              s.EndDate == SemesterEnd &&
              (s.Status == "Pending" ||
               s.Status == "Approved"));

      if (reservedSeats >= route.Capacity)
        return Conflict(new
        {
          message = "Selected route is full."
        });

      // Fee calculated by backend
      decimal fee = request.TransportType == "OneWay"
          ? 150m
          : 300m;

      var subscription = new Subscription
      {
        StudentId = request.StudentId,
        RouteId = request.RouteId,
        StopId = request.StopId,
        TransportType = request.TransportType,
        Fee = fee,
        Status = "Pending",
        StartDate = SemesterStart,
        EndDate = SemesterEnd,
        RequestedAt = DateTime.Now,
        ReferenceNumber = "SUB-" +
              Guid.NewGuid().ToString("N")[..12].ToUpperInvariant()
      };

      _context.Subscriptions.Add(subscription);
      await _context.SaveChangesAsync();

      return StatusCode(201, new
      {
        message = "Subscription request created successfully.",
        subscriptionId = subscription.SubscriptionId,
        referenceNumber = subscription.ReferenceNumber,
        fee = subscription.Fee,
        status = subscription.Status,
        startDate = subscription.StartDate,
        endDate = subscription.EndDate
      });
    }

    // ============================================
    // ADMIN ENDPOINTS
    // ============================================

    // GET: api/subscriptions/admin
    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllSubscriptions()
    {
      var subscriptions = await _context.Subscriptions
          .AsNoTracking()
          .OrderByDescending(s => s.RequestedAt)
          .Select(s => new
          {
            s.SubscriptionId,
            s.ReferenceNumber,
            s.StudentId,
            studentName = s.Student.FullName,
            s.RouteId,
            routeName = s.Route.Name,
            s.StopId,
            stopName = s.Stop.Name,
            s.TransportType,
            s.Fee,
            s.Status,
            s.StartDate,
            s.EndDate,
            s.RequestedAt
          })
          .ToListAsync();

      return Ok(subscriptions);
    }

    // PATCH: api/subscriptions/admin/{id}/approve
    [HttpPatch("admin/{id:int}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ApproveSubscription(int id)
    {
      var subscription = await _context.Subscriptions
          .FirstOrDefaultAsync(s => s.SubscriptionId == id);

      if (subscription == null)
        return NotFound(new
        {
          message = "Subscription not found."
        });

      if (subscription.Status != "Pending")
        return Conflict(new
        {
          message = "Only pending subscriptions can be approved."
        });

      subscription.Status = "Approved";
      await _context.SaveChangesAsync();

      return Ok(new
      {
        message = "Subscription approved successfully.",
        subscriptionId = subscription.SubscriptionId,
        status = subscription.Status
      });
    }

    // PATCH: api/subscriptions/admin/{id}/reject
    [HttpPatch("admin/{id:int}/reject")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RejectSubscription(int id)
    {
      var subscription = await _context.Subscriptions
          .FirstOrDefaultAsync(s => s.SubscriptionId == id);

      if (subscription == null)
        return NotFound(new
        {
          message = "Subscription not found."
        });

      if (subscription.Status != "Pending")
        return Conflict(new
        {
          message = "Only pending subscriptions can be rejected."
        });

      subscription.Status = "Rejected";
      await _context.SaveChangesAsync();

      return Ok(new
      {
        message = "Subscription rejected successfully.",
        subscriptionId = subscription.SubscriptionId,
        status = subscription.Status
      });
    }

    // ============================================
    // HELPER
    // ============================================

    private async Task<int?> GetParentIdAsync()
    {
      var userIdValue = User.FindFirstValue(
          ClaimTypes.NameIdentifier);

      if (!int.TryParse(userIdValue, out var userId))
        return null;

      var parent = await _context.Parents
          .AsNoTracking()
          .FirstOrDefaultAsync(p => p.UserId == userId);

      return parent?.ParentId;
    }
  }
}
