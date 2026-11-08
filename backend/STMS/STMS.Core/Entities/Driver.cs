using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace STMS.Core.Entities
{
  public class Driver
  {
    public int DriverId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string? LicenseNumber { get; set; }

    public bool IsActive { get; set; } = true;
  }
}
