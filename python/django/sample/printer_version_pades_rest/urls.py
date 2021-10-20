from django.urls import path

from . import views

urlpatterns = [
    path('<file_id>', views.index, name='index'),
]