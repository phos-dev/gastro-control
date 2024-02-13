using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using core.Contexts;
using core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace core
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            try
            {
                var factory = new ConnectionFactory { HostName = "rabbitmq" };
                var connection = factory.CreateConnection();
                using var channel = connection.CreateModel();
                channel.QueueDeclare("paid_orders_queue");
                var consumer = new EventingBasicConsumer(channel);
                // Gambi + Falta validacao
                consumer.Received += async (model, eventArgs) =>
                {
                    var body = eventArgs.Body.ToArray();
                    var message = Encoding.UTF8.GetString(body);
                    var json = JsonConvert.DeserializeObject<ProcessOrderDto>(message);

                    using (var scope = host.Services.CreateScope())
                    {
                        var db = scope.ServiceProvider.GetRequiredService<OrderDbContext>();

                        Order order = await db.Orders.Where(x => x.Id == json.order_id).FirstOrDefaultAsync();
                        if (order != null)
                        {
                            order.Status = "success";
                            await db.SaveChangesAsync();
                        }
                    }


                };

                channel.BasicConsume(queue: "paid_orders_queue", autoAck: true, consumer: consumer);
            }
            catch
            {

            }
           

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
