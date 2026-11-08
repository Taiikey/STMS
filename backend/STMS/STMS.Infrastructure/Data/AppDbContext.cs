using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



using STMS.Core.Entities;

namespace STMS.Infrastructure.Data
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(
        DbContextOptions<AppDbContext> options
    ) : base(options)
    {
    }

    // Tables
    public DbSet<User> Users { get; set; }
    public DbSet<Parent> Parents { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Bus> Buses { get; set; }
    public DbSet<Driver> Drivers { get; set; }
    public DbSet<Route> Routes { get; set; }
    public DbSet<Stop> Stops { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<ChangeRequest> ChangeRequests { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      // USERS
      modelBuilder.Entity<User>(entity =>
      {
        entity.ToTable("USERS");

        entity.HasKey(e => e.UserId);

        entity.Property(e => e.UserId)
              .HasColumnName("USERID")
              .ValueGeneratedOnAdd();

        entity.Property(e => e.Email)
              .HasColumnName("EMAIL")
              .HasMaxLength(150)
              .IsRequired();

        entity.HasIndex(e => e.Email).IsUnique();

        entity.Property(e => e.Password)
              .HasColumnName("PASSWORD")
              .HasMaxLength(255)
              .IsRequired();

        entity.Property(e => e.Role)
              .HasColumnName("ROLE")
              .HasMaxLength(20)
              .IsRequired();

        entity.Property(e => e.IsActive)
              .HasColumnName("ISACTIVE")
              .HasColumnType("NUMBER(1)")
              .HasConversion<int>()
              .HasDefaultValue(true);

        entity.Property(e => e.CreatedAt)
              .HasColumnName("CREATEDAT")
              .HasColumnType("DATE")
              .HasDefaultValueSql("SYSDATE");
      });

      // PARENTS
      modelBuilder.Entity<Parent>(entity =>
      {
        entity.ToTable("PARENTS");

        entity.HasKey(e => e.ParentId);

        entity.Property(e => e.ParentId)
              .HasColumnName("PARENTID")
              .ValueGeneratedOnAdd();

        entity.Property(e => e.UserId)
              .HasColumnName("USERID")
              .IsRequired();

        entity.HasIndex(e => e.UserId)
              .IsUnique();

        entity.Property(e => e.FullName)
              .HasColumnName("FULLNAME")
              .HasMaxLength(150)
              .IsRequired();

        entity.Property(e => e.Phone)
              .HasColumnName("PHONE")
              .HasMaxLength(20)
              .IsRequired();

        entity.Property(e => e.Address)
              .HasColumnName("ADDRESS")
              .HasMaxLength(250)
              .IsRequired();

        entity.HasOne(e => e.User)
              .WithOne()
              .HasForeignKey<Parent>(e => e.UserId)
              .OnDelete(DeleteBehavior.NoAction);
      });

      // STUDENTS
      modelBuilder.Entity<Student>(entity =>
      {
        entity.ToTable("STUDENTS");

        entity.HasKey(e => e.StudentId);

        entity.Property(e => e.StudentId)
              .HasColumnName("STUDENTID")
              .ValueGeneratedOnAdd();

        entity.Property(e => e.ParentId)
              .HasColumnName("PARENTID")
              .IsRequired();

        entity.Property(e => e.FullName)
              .HasColumnName("FULLNAME")
              .HasMaxLength(150)
              .IsRequired();

        entity.Property(e => e.Grade)
              .HasColumnName("GRADE")
              .HasMaxLength(20)
              .IsRequired();

        entity.Property(e => e.ClassName)
              .HasColumnName("CLASSNAME")
              .HasMaxLength(20)
              .IsRequired();

        entity.Property(e => e.DateOfBirth)
              .HasColumnName("DATEOFBIRTH")
              .HasColumnType("DATE");

        entity.Property(e => e.Notes)
              .HasColumnName("NOTES")
              .HasMaxLength(500);

        entity.HasOne(e => e.Parent)
              .WithMany()
              .HasForeignKey(e => e.ParentId)
              .OnDelete(DeleteBehavior.NoAction);
      });

      // BUSES
      modelBuilder.Entity<Bus>(entity =>
      {
        entity.ToTable("BUSES");

        entity.HasKey(e => e.BusId);

        entity.Property(e => e.BusId)
              .HasColumnName("BUSID")
              .ValueGeneratedOnAdd();

        entity.Property(e => e.PlateNumber)
              .HasColumnName("PLATENUMBER")
              .HasMaxLength(20)
              .IsRequired();

        entity.HasIndex(e => e.PlateNumber)
              .IsUnique();

        entity.Property(e => e.Capacity)
              .HasColumnName("CAPACITY")
              .IsRequired();

        entity.Property(e => e.IsActive)
              .HasColumnName("ISACTIVE")
              .HasColumnType("NUMBER(1)")
              .HasConversion<int>()
              .HasDefaultValue(true)
              .IsRequired();
      });

      // DRIVERS
      modelBuilder.Entity<Driver>(entity =>
      {
        entity.ToTable("DRIVERS");

        entity.HasKey(e => e.DriverId);

        entity.Property(e => e.DriverId)
              .HasColumnName("DRIVERID")
              .ValueGeneratedOnAdd();

        entity.Property(e => e.FullName)
              .HasColumnName("FULLNAME")
              .HasMaxLength(150)
              .IsRequired();

        entity.Property(e => e.Phone)
              .HasColumnName("PHONE")
              .HasMaxLength(20)
              .IsRequired();

        entity.Property(e => e.LicenseNumber)
              .HasColumnName("LICENSENUMBER")
              .HasMaxLength(50)
              .IsRequired(false);

        entity.HasIndex(e => e.LicenseNumber)
              .IsUnique();

        entity.Property(e => e.IsActive)
              .HasColumnName("ISACTIVE")
              .HasColumnType("NUMBER(1)")
              .HasConversion<int>()
              .HasDefaultValue(true)
              .IsRequired();
      });

      // ROUTES
      modelBuilder.Entity<Route>(entity =>
      {
        entity.ToTable("ROUTES");

        entity.HasKey(e => e.RouteId);

        entity.Property(e => e.RouteId)
              .HasColumnName("ROUTEID")
              .ValueGeneratedOnAdd();

        entity.Property(e => e.RouteNumber)
              .HasColumnName("ROUTENUMBER")
              .HasMaxLength(20)
              .IsRequired();

        entity.HasIndex(e => e.RouteNumber)
              .IsUnique();

        entity.Property(e => e.Name)
              .HasColumnName("NAME")
              .HasMaxLength(150)
              .IsRequired();

        entity.Property(e => e.StartPoint)
              .HasColumnName("STARTPOINT")
              .HasMaxLength(150)
              .IsRequired();

        entity.Property(e => e.Destination)
              .HasColumnName("DESTINATION")
              .HasMaxLength(150)
              .IsRequired();

        entity.Property(e => e.ServiceArea)
              .HasColumnName("SERVICEAREA")
              .HasMaxLength(100)
              .IsRequired();

        entity.Property(e => e.Capacity)
              .HasColumnName("CAPACITY")
              .IsRequired();

        entity.Property(e => e.IsActive)
              .HasColumnName("ISACTIVE")
              .HasColumnType("NUMBER(1)")
              .HasConversion<int>()
              .HasDefaultValue(true)
              .IsRequired();

        entity.Property(e => e.BusId)
              .HasColumnName("BUSID");

        entity.Property(e => e.DriverId)
              .HasColumnName("DRIVERID");

        entity.HasOne(e => e.Bus)
              .WithMany()
              .HasForeignKey(e => e.BusId)
              .OnDelete(DeleteBehavior.NoAction);

        entity.HasOne(e => e.Driver)
              .WithMany()
              .HasForeignKey(e => e.DriverId)
              .OnDelete(DeleteBehavior.NoAction);
      });

      // STOPS
      modelBuilder.Entity<Stop>(entity =>
      {
        entity.ToTable("STOPS");

        entity.HasKey(e => e.StopId);

        entity.Property(e => e.StopId)
              .HasColumnName("STOPID")
              .ValueGeneratedOnAdd();

        entity.Property(e => e.RouteId)
              .HasColumnName("ROUTEID")
              .IsRequired();

        entity.Property(e => e.Name)
              .HasColumnName("NAME")
              .HasMaxLength(150)
              .IsRequired();

        entity.Property(e => e.StopOrder)
              .HasColumnName("STOPORDER")
              .IsRequired();

        entity.Property(e => e.PickupTime)
              .HasColumnName("PICKUPTIME")
              .HasMaxLength(5);

        entity.Property(e => e.DropoffTime)
              .HasColumnName("DROPOFFTIME")
              .HasMaxLength(5);

        entity.HasOne(e => e.Route)
              .WithMany()
              .HasForeignKey(e => e.RouteId)
              .OnDelete(DeleteBehavior.NoAction);
      });

      // SUBSCRIPTIONS
      modelBuilder.Entity<Subscription>(entity =>
      {
        entity.ToTable("SUBSCRIPTIONS");

        entity.HasKey(e => e.SubscriptionId);

        entity.Property(e => e.SubscriptionId)
              .HasColumnName("SUBSCRIPTIONID")
              .ValueGeneratedOnAdd();

        entity.Property(e => e.ReferenceNumber)
              .HasColumnName("REFERENCENUMBER")
              .HasMaxLength(30)
              .IsRequired();

        entity.HasIndex(e => e.ReferenceNumber)
              .IsUnique();

        entity.Property(e => e.StudentId)
              .HasColumnName("STUDENTID")
              .IsRequired();

        entity.Property(e => e.RouteId)
              .HasColumnName("ROUTEID")
              .IsRequired();

        entity.Property(e => e.StopId)
              .HasColumnName("STOPID")
              .IsRequired();

        entity.Property(e => e.TransportType)
              .HasColumnName("TRANSPORTTYPE")
              .HasMaxLength(20)
              .IsRequired();

        entity.Property(e => e.Fee)
              .HasColumnName("FEE")
              .HasColumnType("NUMBER(10,2)")
              .IsRequired();

        entity.Property(e => e.Status)
              .HasColumnName("STATUS")
              .HasMaxLength(20)
              .IsRequired();

        entity.Property(e => e.StartDate)
              .HasColumnName("STARTDATE")
              .HasColumnType("DATE")
              .IsRequired();

        entity.Property(e => e.EndDate)
              .HasColumnName("ENDDATE")
              .HasColumnType("DATE")
              .IsRequired();

        entity.Property(e => e.RequestedAt)
              .HasColumnName("REQUESTEDAT")
              .HasColumnType("DATE")
              .HasDefaultValueSql("SYSDATE");

        entity.HasOne(e => e.Student)
              .WithMany()
              .HasForeignKey(e => e.StudentId)
              .OnDelete(DeleteBehavior.NoAction);

        entity.HasOne(e => e.Route)
              .WithMany()
              .HasForeignKey(e => e.RouteId)
              .OnDelete(DeleteBehavior.NoAction);

        entity.HasOne(e => e.Stop)
              .WithMany()
              .HasForeignKey(e => e.StopId)
              .OnDelete(DeleteBehavior.NoAction);
      });

      // PAYMENTS
      modelBuilder.Entity<Payment>(entity =>
      {
        entity.ToTable("PAYMENTS");

        entity.HasKey(e => e.PaymentId);

        entity.Property(e => e.PaymentId)
              .HasColumnName("PAYMENTID")
              .ValueGeneratedOnAdd();

        entity.Property(e => e.SubscriptionId)
              .HasColumnName("SUBSCRIPTIONID")
              .IsRequired();

        entity.Property(e => e.AmountDue)
              .HasColumnName("AMOUNTDUE")
              .HasColumnType("NUMBER(10,2)")
              .IsRequired();

        entity.Property(e => e.AmountPaid)
              .HasColumnName("AMOUNTPAID")
              .HasColumnType("NUMBER(10,2)")
              .HasDefaultValue(0m);

        entity.Property(e => e.Status)
              .HasColumnName("STATUS")
              .HasMaxLength(20)
              .IsRequired();

        entity.Property(e => e.PaymentDate)
              .HasColumnName("PAYMENTDATE")
              .HasColumnType("DATE");

        entity.Property(e => e.RecordedBy)
              .HasColumnName("RECORDEDBY");

        entity.Property(e => e.Notes)
              .HasColumnName("NOTES")
              .HasMaxLength(300);

        entity.HasOne(e => e.Subscription)
              .WithMany()
              .HasForeignKey(e => e.SubscriptionId)
              .OnDelete(DeleteBehavior.NoAction);

        entity.HasOne(e => e.RecordedByUser)
              .WithMany()
              .HasForeignKey(e => e.RecordedBy)
              .OnDelete(DeleteBehavior.NoAction);
      });

      // CHANGE_REQUESTS
      modelBuilder.Entity<ChangeRequest>(entity =>
      {
        entity.ToTable("CHANGE_REQUESTS");

        entity.HasKey(e => e.RequestId);

        entity.Property(e => e.RequestId)
              .HasColumnName("REQUESTID")
              .ValueGeneratedOnAdd();

        entity.Property(e => e.SubscriptionId)
              .HasColumnName("SUBSCRIPTIONID")
              .IsRequired();

        entity.Property(e => e.RequestType)
              .HasColumnName("REQUESTTYPE")
              .HasMaxLength(20)
              .IsRequired();

        entity.Property(e => e.Reason)
              .HasColumnName("REASON")
              .HasMaxLength(500);

        entity.Property(e => e.Status)
              .HasColumnName("STATUS")
              .HasMaxLength(20)
              .IsRequired();

        entity.Property(e => e.RequestedAt)
              .HasColumnName("REQUESTEDAT")
              .HasColumnType("DATE")
              .HasDefaultValueSql("SYSDATE");

        entity.HasOne(e => e.Subscription)
              .WithMany()
              .HasForeignKey(e => e.SubscriptionId)
              .OnDelete(DeleteBehavior.NoAction);
      });

    }
  }
}
