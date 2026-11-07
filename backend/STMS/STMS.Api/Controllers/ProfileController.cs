
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace STMS.Api.Controllers
{
  [ApiController]
  [Route("api/profile")]
  [Authorize]
  public class ProfileController : ControllerBase
  {
    // Any authenticated user
    [HttpGet]
    public IActionResult GetProfile()
    {
      return Ok(new
      {
        message = "You are authenticated!",
        userId = User.FindFirstValue(
              ClaimTypes.NameIdentifier),
        email = User.FindFirstValue(
              ClaimTypes.Email),
        role = User.FindFirstValue(
              ClaimTypes.Role)
      });
    }

    // Parent only
    [HttpGet("parent")]
    [Authorize(Roles = "Parent")]
    public IActionResult ParentOnly()
    {
      return Ok(new
      {
        message = "Welcome Parent!",
        role = User.FindFirstValue(ClaimTypes.Role)
      });
    }

    // Admin only
    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public IActionResult AdminOnly()
    {
      return Ok(new
      {
        message = "Welcome Admin!",
        role = User.FindFirstValue(ClaimTypes.Role)
      });
    }
  }
}
