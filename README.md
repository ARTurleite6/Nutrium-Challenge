# Nutrium Challenge - Appointment Requests System

A full-stack web application that connects patients with nutritionists, allowing guests to search for nutritionists and request appointments with them.

## 🚀 Technologies Used

### Backend
- **Ruby** 3.0+
- **Ruby on Rails** 7.0+
- **PostgreSQL** 14+
- **Active Model Serializers** for API responses
- **RSpec** for testing
- **FactoryBot** for test data generation

### Frontend
- **React** 18+
- **TypeScript** 
- **TailwindCSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

## 📋 Prerequisites

Make sure you have the following installed on your system:

- Ruby 3.0+
- Node.js 18+
- PostgreSQL 14+
- Git

### Alternative: Using Mise (Recommended)

This project includes `.mise.toml` configuration for easy environment management. If you have [mise](https://mise.jdx.dev/) installed:

```bash
# Install mise if you haven't already
curl https://mise.run | sh

# Install all required tools automatically
mise install

# Activate the environment
mise activate
```

This will automatically install and configure the correct versions of Ruby, Node.js, and other development tools specified in the project.

## 🛠 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd nutrium-challenge
```

### 2. Backend Setup

```bash
cd backend

# If using mise, it will automatically use the correct Ruby version
# Otherwise, ensure you're using Ruby 3.0+

# Install Ruby dependencies
bundle install

# Create and setup database
rails db:create
rails db:migrate

# Seed the database with sample data
rails db:seed

# Start the Rails server
rails server
```

The backend API will be available at `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend

# If using mise, it will automatically use the correct Node.js version
# Otherwise, ensure you're using Node.js 18+

# Setup environment variables
cp .env.sample .env
# Configure them if needed with your code editor of choice

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will be available at `http://localhost:5173`

## 🗄 Database Schema

### Core Models

- **Nutritionist**: Stores nutritionist information (name, license_number, title)
- **Service**: Available services (Weight Loss, Sports Nutrition, etc.)
- **Location**: Physical locations where services are provided
- **Guest**: Patient information (name, email)
- **NutritionistService**: Junction table linking nutritionists to services with pricing and delivery methods
- **Appointment**: Appointment requests between guests and nutritionists

### Database Diagram
```dbml
Table nutritionists {
  id uuid [primary key]
  name varchar [not null]
  license_number varchar [unique, not null]
  title varchar [not null]
  email varchar [unique]
  phone varchar
  bio text
  avatar_url varchar
  website_url varchar
  is_active boolean [default: true]
  created_at timestamp
  updated_at timestamp

  indexes {
    license_number [unique]
    email [unique]
    is_active
  }
}

Table services {
  id uuid [primary key]
  name varchar [not null, unique]
  description text
  created_at timestamp
  updated_at timestamp
}

Table locations {
  id uuid [primary key]
  full_address varchar [not null]
  city varchar [not null]
  coordinates point
  created_at timestamp
  updated_at timestamp
}

Table guests {
  id uuid [primary key]
  name varchar [not null]
  email varchar [not null, unique]
  created_at timestamp
  updated_at timestamp
}

Table nutritionist_services {
  id uuid [primary key]
  nutritionist_id uuid [not null, ref: > nutritionists.id]
  service_id uuid [not null, ref: > services.id]
  location_id uuid [not null, ref: > locations.id]
  pricing decimal [not null]
  delivery_method integer [not null] // 0: in_person, 1: online, 2: hybrid
  appointment_type integer [not null] // 0: first_appointment, 1: follow_up
  created_at timestamp
  updated_at timestamp

  indexes {
    (nutritionist_id, service_id, location_id, delivery_method, appointment_type) [unique]
    delivery_method
    appointment_type
    pricing
  }
}

Table appointments {
  id uuid [primary key]
  guest_id uuid [not null, ref: > guests.id]
  nutritionist_service_id uuid [not null, ref: > nutritionist_services.id]
  event_date datetime [not null]
  state integer [default: 0] // 0: pending, 1: accepted, 2: rejected
  created_at timestamp
  updated_at timestamp

  indexes {
    guest_id
    nutritionist_service_id
    event_date
    state
    (guest_id, state) [name: 'guest_pending_appointments']
  }
}
```

> **Visualize this schema**: Copy the DBML code above and paste it into [dbdiagram.io](https://dbdiagram.io) to generate an interactive database diagram.

## 🎯 Features Implemented

### Guest Flow
- ✅ **Search Functionality**: Search nutritionists by name or service
- ✅ **Location-based Results**: Filter by city/location  
- ✅ **Appointment Booking**: Request appointments with selected nutritionists
- ✅ **Guest Management**: Identified by email, one pending request at a time
- ✅ **Email Notifications**: Receive updates when requests are answered

### Nutritionist Flow
- ✅ **Request Management**: View all incoming appointment requests
- ✅ **Accept/Reject Actions**: Process appointment requests
- ✅ **Automatic Conflict Resolution**: Reject overlapping appointments
- ✅ **Email Notifications**: Notify guests when decisions are made

## 🏃‍♂️ How to Run the Application

### Development Mode

1. **Start Backend** (Terminal 1):
```bash
cd backend
rails server
```

2. **Start Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

3. **Access the Application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Testing

#### Backend Tests
```bash
cd backend
bundle exec rspec
```

## 🌟 Extra Features Implemented

- ✅ **Utility-First CSS**: Full TailwindCSS implementation
- ⏳ **Advanced Search**: Real-time search with multiple criteria
- ✅ **Testing Strategy**: RSpec for backend testing
- ✅ **Caching**: Rails caching for search results
- ✅ **Internationalization**: Multi-language support

## 📦 Sample Data

The application comes pre-seeded with:

- **12 Nutritionists** with realistic names and credentials
- **12 Services** covering various nutrition specialties
- **8 Locations** across Portuguese cities
- **Multiple Service Combinations** with different pricing for online/in-person and first/follow-up appointments

## 🔌 API Endpoints

### Public Endpoints
- `GET /api/nutritionist_services` - Search nutritionists and services with search (nutritionist's name or by services name) and location as optional parameters for filtering
- `POST /api/appointments` - Create appointment requests

### Nutritionist Endpoints
- `GET /api/nutritionists/:id/appointments` - View appointment requests
- `PUT /api/appointments/:id/accept` - Accept appointment
- `PUT /api/appointments/:id/reject` - Reject appointment

## 🔧 Development Tools

### Without Mise

If you prefer manual installation:
- Ensure Ruby 3.0+ is installed via `rbenv`, `rvm`, or system package manager
- Ensure Node.js 18+ is installed via `nvm`, `fnm`, or system package manager
- Ensure PostgreSQL 14+ is running and accessible

## 🔧 Configuration

### Environment Variables

Create `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000 (Backend URL)
```
