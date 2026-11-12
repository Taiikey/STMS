
namespace STMS.Api.DTOs.Subscriptions
{
  public class CreateSubscriptionRequest
  {
    public int StudentId { get; set; }

    public int RouteId { get; set; }

    public int StopId { get; set; }

    public string TransportType { get; set; } = string.Empty;
  }
}
