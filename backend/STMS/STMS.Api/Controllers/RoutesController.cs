
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using STMS.Infrastructure.Data;

namespace STMS.Api.Controllers
{
  [ApiController]
  [Route("api/routes")]
  public class RoutesController : ControllerBase
  {
    private readonly AppDbContext _context;

    public RoutesController(AppDbContext context)
    {
      _context = context;
    }

    // GET /api/routes
    [HttpGet]
    public async Task<IActionResult> GetRoutes(
        [FromQuery] string? search,
        [FromQuery] string? area)
    {
      var routesQuery = _context.Routes.AsNoTracking();

      if (!string.IsNullOrWhiteSpace(search))
      {
        var keyword = search.Trim().ToLower();

        routesQuery = routesQuery.Where(r =>
            r.Name.ToLower().Contains(keyword) ||
            r.RouteNumber.ToLower().Contains(keyword) ||
            r.StartPoint.ToLower().Contains(keyword) ||
            r.Destination.ToLower().Contains(keyword));
      }

      if (!string.IsNullOrWhiteSpace(area))
      {
        var selectedArea = area.Trim().ToLower();

        routesQuery = routesQuery.Where(r =>
            r.ServiceArea.ToLower() == selectedArea);
      }

      var routesFromDatabase = await routesQuery.ToListAsync();

      var activeRoutes = routesFromDatabase
          .Where(r => r.IsActive)
          .OrderBy(r => r.RouteNumber)
          .Select(r => new
          {
            r.RouteId,
            r.RouteNumber,
            r.Name,
            r.StartPoint,
            r.Destination,
            r.ServiceArea,
            r.Capacity,
            r.BusId,
            r.DriverId
          })
          .ToList();

      return Ok(activeRoutes);
    }

    // GET /api/routes/areas
    [HttpGet("areas")]
    public async Task<IActionResult> GetAreas()
    {
      var routes = await _context.Routes
          .AsNoTracking()
          .ToListAsync();

      var areas = routes
          .Where(r => r.IsActive)
          .Select(r => r.ServiceArea)
          .Where(area => !string.IsNullOrWhiteSpace(area))
          .Distinct(StringComparer.OrdinalIgnoreCase)
          .OrderBy(area => area)
          .ToList();

      return Ok(areas);
    }

    // GET /api/routes/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetRouteById(int id)
    {
      var route = await _context.Routes
          .AsNoTracking()
          .FirstOrDefaultAsync(r => r.RouteId == id);

      if (route == null || !route.IsActive)
      {
        return NotFound(new
        {
          message = "Route not found."
        });
      }

      var stops = await _context.Stops
          .AsNoTracking()
          .Where(s => s.RouteId == id)
          .OrderBy(s => s.StopOrder)
          .Select(s => new
          {
            s.StopId,
            s.Name,
            s.StopOrder,
            s.PickupTime,
            s.DropoffTime
          })
          .ToListAsync();

      return Ok(new
      {
        route.RouteId,
        route.RouteNumber,
        route.Name,
        route.StartPoint,
        route.Destination,
        route.ServiceArea,
        route.Capacity,
        route.BusId,
        route.DriverId,
        Stops = stops
      });
    }
  }
}
