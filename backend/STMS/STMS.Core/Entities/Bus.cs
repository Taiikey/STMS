using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace STMS.Core.Entities
{
  public class Bus
  {
    public int BusId { get; set; }

    public string PlateNumber { get; set; } = string.Empty;

    public int Capacity { get; set; }

    public bool IsActive { get; set; } = true;
  }
}
