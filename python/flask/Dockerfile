# Use the Alpine base image with Python 3.7
FROM python:3.7-alpine

# Install necessary packages
RUN apk update && \
    apk add --no-cache \
    git

# Clone the project from GitHub
RUN git clone https://github.com/LacunaSoftware/PkiSuiteSamples

# Set the working directory inside the container
WORKDIR /PkiSuiteSamples/python/flask

# Install project dependencies
RUN pip install -r requirements.txt

# Set environment variables
ENV FLASK_APP=sample
ENV FLASK_ENV=development

# Expose the port your Flask app will run on
EXPOSE 5000

# Command to run the Flask application
CMD ["flask", "run", "--host", "0.0.0.0"]