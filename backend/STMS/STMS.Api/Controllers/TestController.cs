
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using STMS.Infrastructure.Data;

namespace STMS.Api.Controllers
{
  [ApiController]
  [Route("api/test")]
  public class TestController : ControllerBase
  {
    private readonly AppDbContext _context;

    public TestController(AppDbContext context)
    {
      _context = context;
    }

    [HttpGet("db")]
    public async Task<IActionResult> TestDatabase()
    {
      try
      {
        int count = await _context.Users.CountAsync();

        return Ok(new
        {
          message = "Oracle connection successful!",
          usersCount = count
        });
      }
      catch (Exception)
      {
        return StatusCode(500, new
        {
          message = "Database connection or query failed."
        });
      }
    }
  }
}
