using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace STMS.Core.Entities
{
  public class Subscription
  {
    public int SubscriptionId { get; set; }

    public string ReferenceNumber { get; set; } = string.Empty;

    public int StudentId { get; set; }

    public int RouteId { get; set; }

    public int StopId { get; set; }

    public string TransportType { get; set; } = string.Empty;

    public decimal Fee { get; set; }

    public string Status { get; set; } = "Pending";

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public DateTime RequestedAt { get; set; }
    public Student Student { get; set; } = null!;

    public Route Route { get; set; } = null!;

    public Stop Stop { get; set; } = null!;
  }
}
