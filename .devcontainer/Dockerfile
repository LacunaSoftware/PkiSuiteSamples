FROM mcr.microsoft.com/devcontainers/base:ubuntu

# System tools
RUN apt-get update && apt-get install -y \
    curl \
    zip \
    unzip \
    ca-certificates \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# SDKMAN
ENV SDKMAN_DIR=/usr/local/sdkman
RUN curl -s "https://get.sdkman.io" | bash

# Java toolchain (same as container A)
RUN bash -c "source $SDKMAN_DIR/bin/sdkman-init.sh && \
    sdk install java 8.0.472-tem && \
    sdk install gradle 8.14 && \
    sdk install maven 3.9.9 && \
    sdk default java 8.0.472-tem && \
    sdk default gradle 8.14 && \
    sdk default maven 3.9.9"


# Expose tools
ENV PATH="$SDKMAN_DIR/candidates/java/current/bin:\
$SDKMAN_DIR/candidates/gradle/current/bin:\
$SDKMAN_DIR/candidates/maven/current/bin:$PATH"

