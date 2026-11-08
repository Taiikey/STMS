using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace STMS.Core.Entities
{
  public class Payment
  {
    public int PaymentId { get; set; }

    public int SubscriptionId { get; set; }

    public decimal AmountDue { get; set; }

    public decimal AmountPaid { get; set; } = 0;

    public string Status { get; set; } = "Unpaid";

    public DateTime? PaymentDate { get; set; }

    public int? RecordedBy { get; set; }

    public string? Notes { get; set; }

    public Subscription Subscription { get; set; } = null!;

    public User? RecordedByUser { get; set; }
  }
}
