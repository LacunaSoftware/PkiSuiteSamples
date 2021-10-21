"""PkiSuitePythonDjangoSample URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import include, path

urlpatterns = [
    path('', include('homepage.urls')),
    path('download/', include('download.urls')),
    path('server-files/', include('server_files.urls')),
    path('receita-simples-rest/', include('receita_simples_rest.urls')),
    path('pades-signature-rest/', include('pades_signature_rest.urls')),
    path('open-pades-rest/', include('open_pades_rest.urls')),
    path('printer-version-pades-rest/', include('printer_version_pades_rest.urls')),
    path('check-pades-rest/', include('check_pades_rest.urls')),
]
