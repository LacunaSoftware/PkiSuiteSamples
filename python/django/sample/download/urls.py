from django.urls import path

from . import views

urlpatterns = [
    path('<filename>', views.get_file),
    path('doc/<file_id>', views.get_doc),
    path('sample/<file_id>', views.get_sample),
]