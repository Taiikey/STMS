
using System;
using System.ComponentModel.DataAnnotations;

namespace STMS.Api.DTOs.Students
{
  public class UpdateStudentRequest
  {
    [Required(ErrorMessage = "Student name is required.")]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Grade is required.")]
    [MaxLength(20)]
    public string Grade { get; set; } = string.Empty;

    [Required(ErrorMessage = "Class name is required.")]
    [MaxLength(20)]
    public string ClassName { get; set; } = string.Empty;

    public DateTime? DateOfBirth { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }
  }
}
