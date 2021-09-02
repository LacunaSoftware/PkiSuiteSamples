from django.urls import path

from . import views

urlpatterns = [
    path('<file_to_sign>', views.index, name='start'),
    path('', views.complete, name='complete'),
]