from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from .models import Contact
import json
import logging

logger = logging.getLogger(__name__)

# Create your views here.

def contact_list(request):
    contacts = Contact.objects.all().order_by('-created_at')
    return render(request, 'contact/contact_list.html', {'contacts': contacts})

@csrf_exempt
def contact_submit(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Create new contact entry
            contact = Contact.objects.create(
                name=data['name'],
                email=data['email'],
                subject=data['subject'],
                message=data['message']
            )
            
            # Prepare email content
            subject = f'New Contact Form Submission: {data["subject"]}'
            message = f'''
            Name: {data['name']}
            Email: {data['email']}
            Subject: {data['subject']}
            
            Message:
            {data['message']}
            '''
            
            try:
                # Send email notification
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.DEFAULT_FROM_EMAIL],
                    fail_silently=False,
                )
                logger.info(f"Email sent successfully for contact submission from {data['name']}")
            except Exception as e:
                logger.error(f"Failed to send email: {str(e)}")
                # Continue with the response even if email fails
                # The contact is still saved in the database
            
            return JsonResponse({
                'status': 'success',
                'message': 'Thank you for your message! I will get back to you soon.'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid JSON data'
            }, status=400)
        except KeyError as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Missing required field: {str(e)}'
            }, status=400)
        except Exception as e:
            logger.error(f"Unexpected error in contact_submit: {str(e)}")
            return JsonResponse({
                'status': 'error',
                'message': 'An unexpected error occurred'
            }, status=500)
    
    return JsonResponse({
        'status': 'error',
        'message': 'Invalid request method'
    }, status=405)
