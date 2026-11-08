using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace STMS.Core.Entities
{
  public class Stop
  {
    public int StopId { get; set; }

    public int RouteId { get; set; }

    public string Name { get; set; } = string.Empty;

    public int StopOrder { get; set; }

    public string? PickupTime { get; set; }

    public string? DropoffTime { get; set; }

    public Route Route { get; set; } = null!;
  }
}
