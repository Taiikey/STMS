
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using STMS.Infrastructure.Data;
using STMS.Api.DTOs.Students;
using STMS.Core.Entities;
using System.Security.Claims;

namespace STMS.Api.Controllers
{
  [ApiController]
  [Route("api/students")]
  [Authorize(Roles = "Parent")]
  public class StudentsController : ControllerBase
  {
    private readonly AppDbContext _context;

    public StudentsController(AppDbContext context)
    {
      _context = context;
    }

    // GET: api/students
    [HttpGet]
    public async Task<IActionResult> GetMyStudents()
    {
      var userIdValue = User.FindFirstValue(
          ClaimTypes.NameIdentifier);

      if (!int.TryParse(userIdValue, out var userId))
        return Unauthorized(new
        {
          message = "Invalid user token."
        });

      var parent = await _context.Parents
          .AsNoTracking()
          .FirstOrDefaultAsync(p => p.UserId == userId);

      if (parent == null)
        return NotFound(new
        {
          message = "Parent profile not found."
        });

      var students = await _context.Students
          .AsNoTracking()
          .Where(s => s.ParentId == parent.ParentId)
          .Select(s => new
          {
            s.StudentId,
            s.FullName,
            s.Grade,
            s.ClassName,
            s.DateOfBirth,
            s.Notes
          })
          .ToListAsync();

      return Ok(students);
    }

    // POST: api/students
    [HttpPost]
    public async Task<IActionResult> CreateStudent(
        [FromBody] CreateStudentRequest request)
    {
      var userIdValue = User.FindFirstValue(
          ClaimTypes.NameIdentifier);

      if (!int.TryParse(userIdValue, out var userId))
        return Unauthorized(new
        {
          message = "Invalid user token."
        });

      var parent = await _context.Parents
          .AsNoTracking()
          .FirstOrDefaultAsync(p => p.UserId == userId);

      if (parent == null)
        return NotFound(new
        {
          message = "Parent profile not found."
        });

      if (string.IsNullOrWhiteSpace(request.FullName) ||
          string.IsNullOrWhiteSpace(request.Grade) ||
          string.IsNullOrWhiteSpace(request.ClassName))
      {
        return BadRequest(new
        {
          message = "Student name, grade and class are required."
        });
      }

      var student = new Student
      {
        ParentId = parent.ParentId,
        FullName = request.FullName.Trim(),
        Grade = request.Grade.Trim(),
        ClassName = request.ClassName.Trim(),
        DateOfBirth = request.DateOfBirth,
        Notes = request.Notes?.Trim()
      };

      _context.Students.Add(student);
      await _context.SaveChangesAsync();

      return StatusCode(201, new
      {
        message = "Student created successfully.",
        studentId = student.StudentId
      });
    }

    // PUT: api/students/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateStudent(
        int id,
        [FromBody] UpdateStudentRequest request)
    {
      var userIdValue = User.FindFirstValue(
          ClaimTypes.NameIdentifier);

      if (!int.TryParse(userIdValue, out var userId))
        return Unauthorized(new
        {
          message = "Invalid user token."
        });

      var parent = await _context.Parents
          .AsNoTracking()
          .FirstOrDefaultAsync(p => p.UserId == userId);

      if (parent == null)
        return NotFound(new
        {
          message = "Parent profile not found."
        });

      var student = await _context.Students
          .FirstOrDefaultAsync(s =>
              s.StudentId == id &&
              s.ParentId == parent.ParentId);

      if (student == null)
        return NotFound(new
        {
          message = "Student not found."
        });

      if (string.IsNullOrWhiteSpace(request.FullName) ||
          string.IsNullOrWhiteSpace(request.Grade) ||
          string.IsNullOrWhiteSpace(request.ClassName))
      {
        return BadRequest(new
        {
          message = "Student name, grade and class are required."
        });
      }

      student.FullName = request.FullName.Trim();
      student.Grade = request.Grade.Trim();
      student.ClassName = request.ClassName.Trim();
      student.DateOfBirth = request.DateOfBirth;
      student.Notes = request.Notes?.Trim();

      await _context.SaveChangesAsync();

      return Ok(new
      {
        message = "Student updated successfully.",
        studentId = student.StudentId
      });
    }

    // DELETE: api/students/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteStudent(int id)
    {
      var userIdValue = User.FindFirstValue(
          ClaimTypes.NameIdentifier);

      if (!int.TryParse(userIdValue, out var userId))
        return Unauthorized(new
        {
          message = "Invalid user token."
        });

      var parent = await _context.Parents
          .AsNoTracking()
          .FirstOrDefaultAsync(p => p.UserId == userId);

      if (parent == null)
        return NotFound(new
        {
          message = "Parent profile not found."
        });

      var student = await _context.Students
          .FirstOrDefaultAsync(s =>
              s.StudentId == id &&
              s.ParentId == parent.ParentId);

      if (student == null)
        return NotFound(new
        {
          message = "Student not found."
        });

      // Prevent deleting students with transport subscriptions
      var hasSubscriptions = await _context.Subscriptions
          .AnyAsync(s => s.StudentId == id);

      if (hasSubscriptions)
        return Conflict(new
        {
          message = "Cannot delete a student with transport subscriptions."
        });

      _context.Students.Remove(student);
      await _context.SaveChangesAsync();

      return Ok(new
      {
        message = "Student deleted successfully.",
        studentId = id
      });
    }
  }
}
