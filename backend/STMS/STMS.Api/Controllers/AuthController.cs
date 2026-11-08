
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using STMS.Api.DTOs.Auth;
using STMS.Core.Entities;
using STMS.Infrastructure.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace STMS.Api.Controllers
{
  [ApiController]
  [Route("api/auth")]
  public class AuthController : ControllerBase
  {
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(
        AppDbContext context,
        IConfiguration configuration)
    {
      _context = context;
      _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterRequest request)
    {
      string email = request.Email.Trim().ToLowerInvariant();

      bool emailExists = await _context.Users
          .AnyAsync(u => u.Email.ToLower() == email);

      if (emailExists)
      {
        return Conflict(new
        {
          message = "Email is already registered."
        });
      }

      var user = new User
      {
        Email = email,
        Password = BCrypt.Net.BCrypt.HashPassword(
              request.Password),
        Role = "Parent",
        IsActive = true
      };

      var parent = new Parent
      {
        User = user,
        FullName = request.FullName.Trim(),
        Phone = request.Phone.Trim(),
        Address = request.Address.Trim()
      };

      _context.Parents.Add(parent);

      await _context.SaveChangesAsync();

      return StatusCode(201, new
      {
        message = "Registered successfully"
      });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request)
    {
      string email = request.Email.Trim().ToLowerInvariant();

      var user = await _context.Users
          .FirstOrDefaultAsync(u => u.Email == email);

      if (user == null || !user.IsActive ||
          !BCrypt.Net.BCrypt.Verify(
              request.Password, user.Password))
      {
        return Unauthorized(new
        {
          message = "Invalid email or password."
        });
      }

      var parent = await _context.Parents
          .FirstOrDefaultAsync(p => p.UserId == user.UserId);

      string fullName = parent?.FullName ?? "";

      string jwtKey = _configuration["Jwt:Key"]
          ?? throw new InvalidOperationException(
              "JWT key is missing.");

      string? jwtIssuer = _configuration["Jwt:Issuer"];
      string? jwtAudience = _configuration["Jwt:Audience"];

      int expiryMinutes = int.Parse(
          _configuration["Jwt:ExpiryMinutes"] ?? "60");

      var claims = new List<Claim>
            {
                new Claim(
                    ClaimTypes.NameIdentifier,
                    user.UserId.ToString()),

                new Claim(ClaimTypes.Email, user.Email),

                new Claim(ClaimTypes.Role, user.Role)
            };

      var key = new SymmetricSecurityKey(
          Encoding.UTF8.GetBytes(jwtKey));

      var credentials = new SigningCredentials(
          key,
          SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(
          issuer: jwtIssuer,
          audience: jwtAudience,
          claims: claims,
          expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
          signingCredentials: credentials
      );

      string tokenString =
          new JwtSecurityTokenHandler().WriteToken(token);

      return Ok(new
      {
        token = tokenString,
        role = user.Role,
        fullName,
        email = user.Email
      });
    }
  }
}
