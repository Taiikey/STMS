using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace STMS.Core.Entities
{
  public class Student
  {
    public int StudentId { get; set; }

    public int ParentId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Grade { get; set; } = string.Empty;

    public string ClassName { get; set; } = string.Empty;

    public DateTime? DateOfBirth { get; set; }

    public string? Notes { get; set; }

    public Parent Parent { get; set; } = null!;
  }
}
