#!/bin/bash
set -ex

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Add a small delay to ensure database migrations are complete
echo "Waiting for system to stabilize..."
sleep 10

# Start Django application with gunicorn
echo "Starting Django application..."
gunicorn server.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --threads 2 \
    --timeout 30 \
    --keep-alive 2 \
    --worker-class gthread \
    --max-requests 1000 \
    --max-requests-jitter 50 \
    --access-logfile - \
    --error-logfile - \
    --log-level info
