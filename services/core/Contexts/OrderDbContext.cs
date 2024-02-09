using core.Models;
using Microsoft.EntityFrameworkCore;

namespace core.Contexts
{
    public class OrderDbContext : DbContext 
    {
        protected override void OnConfiguring(DbContextOptionsBuilder options)
           => options.UseSqlite("Data Source=Orders.db");

        public OrderDbContext(DbContextOptions<OrderDbContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Order> Orders { get; set; }
    }
}
