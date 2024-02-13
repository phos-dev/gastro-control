import json
import pika

ROUTING_KEY = 'paid_orders_queue'
EXCHANGE = ''
THREADS = 5

class ProducerPaymentSuccess:
    def __init__(self) -> None:        
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters('rabbitmq', heartbeat=600, blocked_connection_timeout=300)
        )
        self.channel = self.connection.channel()

    def publish(self,method, body):
        print('Inside UserService: Sending to RabbitMQ: ')
        print(body)
        properties = pika.BasicProperties(method)
        self.channel.basic_publish(
            exchange=EXCHANGE, routing_key=ROUTING_KEY, body=body, 
            properties=properties)