from django.conf import settings
from django.http.response import JsonResponse 
from django.http import HttpResponse
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt 
from .producer_payment_success import ProducerPaymentSuccess
from urllib.parse import unquote
import json
import stripe

producerPaymentSuccess = ProducerPaymentSuccess()

@csrf_exempt
def stripe_config(request):
    if request.method == 'GET':
        stripe_config = {'publicKey': settings.STRIPE_PUBLISHABLE_KEY}
        return JsonResponse(stripe_config, safe=False)
    
@csrf_exempt
def create_checkout_session(request):
    if request.method == 'POST':
        domain_url = 'http://localhost:3000/'

        stripe.api_key = settings.STRIPE_SECRET_KEY
        try:
            data = request.body
            data = str(data, encoding='utf-8')
            data = json.loads(data)
            print(data["order_id"])
            print(data["line_items"])
            
            checkout_session = stripe.checkout.Session.create(
                success_url=domain_url + 'payment/success?session_id={CHECKOUT_SESSION_ID}' + '&order_id={}'.format(data["order_id"]),
                cancel_url=domain_url + 'payment/cancelled?order_id={}'.format(data["order_id"]),
                payment_method_types=['card'],
                mode='payment',
                line_items=data["line_items"]
            )
            return JsonResponse({'sessionId': checkout_session['id']})
        except Exception as e:
            return JsonResponse({'error': str(e)})
        
@csrf_exempt
def process_order(request):
    if request.method == 'POST':
        try:
            data = request.body
            data = str(data, encoding='utf-8')
            data = json.loads(data)
            print(data["order_id"])
            
            producerPaymentSuccess.publish("payment_success_method",json.dumps({ "order_id": data["order_id"] }))

            return JsonResponse({ 'data': 'Pedido está processando.' })
        except Exception as e:
            return JsonResponse({'error': str(e)})