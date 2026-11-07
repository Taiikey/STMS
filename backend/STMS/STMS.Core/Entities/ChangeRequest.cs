using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace STMS.Core.Entities
{
  public class ChangeRequest
  {
    public int RequestId { get; set; }

    public int SubscriptionId { get; set; }

    public string RequestType { get; set; } = string.Empty;

    public string? Reason { get; set; }

    public string Status { get; set; } = "Pending";

    public DateTime RequestedAt { get; set; }
    public Subscription Subscription { get; set; } = null!;
  }
}
