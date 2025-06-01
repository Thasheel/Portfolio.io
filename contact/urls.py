from django.urls import path
from . import views

urlpatterns = [
    path('submit/', views.contact_submit, name='contact_submit'),
    path('list/', views.contact_list, name='contact_list'),
] 