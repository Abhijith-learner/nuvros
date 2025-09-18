FROM --platform=linux/amd64 python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy and install Python dependencies
COPY ../requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install gunicorn

# Copy backend application code
COPY . ./

# Make entrypoint executable
RUN chmod +x ./entrypoint.sh

# Expose the Django port
EXPOSE 8000

# Start Django application via entrypoint
ENTRYPOINT ["./entrypoint.sh"]
