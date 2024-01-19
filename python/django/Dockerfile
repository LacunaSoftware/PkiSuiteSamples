# Use the Alpine base image with Python 3.7
FROM python:3.10.7-alpine

# Install necessary packages
# Info: During pip installation, some packages require gcc and other dependencies from linux
# So I had to install a bunch of dev dependencies in order for pip install -r requirements.txt to work
# Change the instruction below carefully
RUN apk update && \
    apk add --no-cache \
    gcc \
    musl-dev \
    postgresql-dev \
    python3-dev \ 
    libffi-dev \ 
    freetype-dev\
    git

# Clone the project from GitHub
RUN git clone https://github.com/LacunaSoftware/PkiSuiteSamples

# Set the working directory inside the container
WORKDIR /PkiSuiteSamples/python/django/sample

# git fetch
RUN git fetch --all

# Checkout specific version as test
RUN git checkout fix/pkg-dependencies-python

# Create a virtual environment and activate it
RUN python -m venv venv
RUN . venv/bin/activate

RUN pip install --upgrade pip

# Install project dependencies
RUN pip install --no-cache-dir -r ../requirements.txt

# Expose the port your Django app will run on
EXPOSE 8000

# Command to run the Django application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]