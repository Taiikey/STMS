using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace STMS.Core.Entities
{
  public class Route
  {
    public int RouteId { get; set; }

    public string RouteNumber { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string StartPoint { get; set; } = string.Empty;

    public string Destination { get; set; } = string.Empty;

    public string ServiceArea { get; set; } = string.Empty;

    public int Capacity { get; set; }

    public bool IsActive { get; set; } = true;

    public int? BusId { get; set; }

    public int? DriverId { get; set; }

    public Bus? Bus { get; set; }

    public Driver? Driver { get; set; }
  }
}
