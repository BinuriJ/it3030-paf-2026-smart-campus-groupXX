# Smart Campus Operations Hub

## Prerequisites

### Option 1: MySQL Database (Recommended for Production)
1. Install MySQL Server
2. Create database: `spring`
3. Update credentials in `application.yml` if needed

### Option 2: H2 Database (For Development/Testing)
- No setup required, uses in-memory database

## Running the Application

### With MySQL (Default):
```bash
mvn spring-boot:run
```

### With H2 Database:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

Or set the profile in application.yml by changing:
```yaml
spring:
  profiles:
    active: h2  # instead of mysql
```

## Database Setup

If using MySQL, run the SQL script:
```sql
mysql -u root -p < create_database.sql
```

## API Endpoints

### Resources
- `GET /api/resources` - List all resources
- `POST /api/resources` - Create resource
- `PUT /api/resources/{id}` - Update resource
- `DELETE /api/resources/{id}` - Delete resource
- `GET /api/resources/{id}/slots` - Get time slots for resource

### Time Slots
- `GET /api/slots` - List all slots
- `GET /api/slots/available` - List available slots
- `POST /api/slots/{id}/book` - Book a slot
- `POST /api/slots/{id}/cancel` - Cancel booking

## Features

- ✅ Automatic time slot creation (8am-5pm)
- ✅ Student booking system
- ✅ Admin resource management
- ✅ Date period availability
- ✅ Real-time slot status updates