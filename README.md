# Nuvr Analytics Portal

A modern analytics portal built with Django REST Framework backend and React frontend, connected to PostgreSQL database.

## Project Structure

```
CSCM/
├── server/           # Django project settings
├── api/             # Django API app
├── frontend/        # React application
├── requirements.txt # Python dependencies
└── README.md        # This file
```

## Features

- **Django Backend**: REST API built with Django REST Framework
- **React Frontend**: Modern, responsive dashboard interface
- **PostgreSQL Integration**: Connected to AWS RDS PostgreSQL instance
- **CORS Enabled**: Seamless communication between frontend and backend
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

## Installation & Setup

### 1. Backend Setup (Django)

1. **Install Python dependencies**:
   ```bash
   cd /Users/alpeshsaharia/Desktop/Purple\ Block\ Code/Nuvr/CSCM
   pip install -r requirements.txt
   ```

2. **Run Django migrations** (if needed):
   ```bash
   python manage.py migrate
   ```

3. **Start the Django development server**:
   ```bash
   python manage.py runserver
   ```
   
   The backend will be available at: `http://localhost:8000`

### 2. Frontend Setup (React)

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start the React development server**:
   ```bash
   npm start
   ```
   
   The frontend will be available at: `http://localhost:3000`

## API Endpoints

### GET `/api/consolidated-data/`
Fetches the top 10 rows from the `public.consolidated_datae` table.

**Response Format**:
```json
{
  "success": true,
  "data": [
    {
      "column1": "value1",
      "column2": "value2",
      ...
    }
  ],
  "count": 10
}
```

## Database Configuration

The application is configured to connect to your PostgreSQL database with the following settings:
- **Host**: pgadmin-nuvr.cbookkykam1o.ap-south-1.rds.amazonaws.com
- **Database**: Nuvr
- **User**: nuvr
- **Port**: 5432

## Usage

1. Start both the Django backend and React frontend servers
2. Open your browser and navigate to `http://localhost:3000`
3. The dashboard will automatically fetch and display the top 10 rows from your PostgreSQL database
4. Use the "Refresh Data" button to reload the data

## Development

### Adding New API Endpoints
1. Add new views in `api/views.py`
2. Register the new URLs in `api/urls.py`

### Customizing the Frontend
1. Modify components in `frontend/src/App.js`
2. Update styles in `frontend/src/App.css`

## Production Deployment

For production deployment:

1. **Django**:
   - Set `DEBUG = False` in settings.py
   - Configure proper ALLOWED_HOSTS
   - Use environment variables for sensitive data
   - Use a production WSGI server like Gunicorn

2. **React**:
   - Run `npm run build` to create production build
   - Serve the build folder with a web server

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify PostgreSQL credentials
   - Check network connectivity to AWS RDS

2. **CORS Errors**:
   - Ensure django-cors-headers is installed
   - Verify CORS settings in Django settings.py

3. **Port Conflicts**:
   - Django runs on port 8000
   - React runs on port 3000
   - Make sure these ports are available

## Dependencies

### Backend (Python)
- Django 5.2.5
- djangorestframework 3.15.2
- django-cors-headers 4.6.0
- psycopg2-binary 2.9.10

### Frontend (Node.js)
- React 18+
- axios 1.6+

## License

This project is part of the Nuvr analytics platform.

