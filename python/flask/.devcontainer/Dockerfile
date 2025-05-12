FROM mcr.microsoft.com/devcontainers/python:1-3.10-bullseye

# Set Flask environment variables
ENV FLASK_APP=sample
ENV FLASK_ENV=development

# Install PKI Express dependencies
RUN apt-get update && apt-get install -y \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install PKI Express
RUN wget https://cdn.lacunasoftware.com/pki-express/linux/pkie-1.34.2.tar.gz \
    && mkdir -p /usr/share/pkie \
    && tar xzf pkie-1.34.2.tar.gz -C /usr/share/pkie \
    && chmod +x /usr/share/pkie/pkie \
    && ln -s /usr/share/pkie/pkie /usr/local/bin/pkie \
    && rm pkie-1.34.2.tar.gz

# Create and configure log directory
RUN mkdir -p /var/log/pkie \
    && chmod 777 /var/log/pkie \
    && pkie config --set logDir=/var/log/pkie

# Copy license file from workspace
COPY LacunaPkiLicense.config /etc/lacunasoftware/pki-express/

# Activate PKI Express with the license
RUN pkie activate /etc/lacunasoftware/pki-express/LacunaPkiLicense.config

# Install Python dependencies
COPY requirements.txt /tmp/pip-tmp/
RUN pip3 --disable-pip-version-check --no-cache-dir install -r /tmp/pip-tmp/requirements.txt \
    && rm -rf /tmp/pip-tmp