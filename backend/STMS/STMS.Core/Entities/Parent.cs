using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace STMS.Core.Entities
{
  public class Parent
  {
    public int ParentId { get; set; }

    public int UserId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public User User { get; set; } = null!; //هاد اسمه Navigation Property.
  }
}
