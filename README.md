# Customer Support Ticketing System with Real-Time Chat

A comprehensive customer support ticketing system built with Laravel backend and real-time chat functionality using Laravel Reverb/Pusher.

## Features

### Authentication & Authorization
- **Token-based authentication** using Laravel Sanctum
- **Two user roles**: Admin and Customer
- Registration, Login, and Logout endpoints
- Secure password hashing

### Ticket Management
- **CRUD operations** for support tickets
- **Ticket fields**: Subject, Description, Category, Priority, Attachment
- **Ticket statuses**: Open, In Progress, Resolved, Closed
- **Priority levels**: Low, Medium, High, Urgent
- **Role-based access**: Customers see only their tickets, Admins see all
- File attachment support (up to 10MB)
- Ticket assignment to admin users

### Comments System
- Both Admins and Customers can comment on tickets
- Full CRUD operations for comments
- Comments are linked to tickets and users
- Real-time comment updates

### Real-Time Chat
- Real-time messaging using Laravel Reverb (or Pusher)
- Private channels for secure communication
- Customer ↔ Admin chat linked to tickets
- Message read status tracking
- Unread message counter
- Broadcasting events for instant message delivery

### Categories
- Predefined support categories
- Admin-only category management
- Categories include: Technical Support, Billing, General Inquiry, Feature Request, Bug Report

## Technology Stack

- **Backend**: Laravel 11.x
- **Authentication**: Laravel Sanctum (Token-based)
- **Real-time**: Laravel Reverb / Pusher
- **Database**: MySQL
- **Broadcasting**: WebSockets
- **File Storage**: Local/Public storage

## Prerequisites

- PHP >= 8.2
- Composer
- MySQL
- Node.js & NPM (for broadcasting)
- Git

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd realtime-chat
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 3. Environment Configuration

```bash
# Copy the environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Database Configuration

Update your `.env` file with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=realtime_chat
DB_USERNAME=root
DB_PASSWORD=your_password
```

Create the database:

```bash
mysql -u root -p
CREATE DATABASE realtime_chat;
exit;
```

### 5. Run Migrations and Seeders

```bash
# Run migrations
php artisan migrate

# Seed the database with initial data
php artisan db:seed
```

This will create:
- An admin user (email: admin@example.com, password: password)
- A customer user (email: customer@example.com, password: password)
- 5 default categories

### 6. Storage Link

```bash
php artisan storage:link
```

### 7. Broadcasting Setup

#### Option A: Laravel Reverb (Recommended)

```bash
# Start Reverb server
php artisan reverb:start
```

#### Option B: Pusher

Update `.env` with your Pusher credentials:

```env
BROADCAST_CONNECTION=pusher
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_APP_CLUSTER=mt1
```

### 8. Start the Application

```bash
# Start Laravel development server
php artisan serve

# In another terminal, compile assets
npm run dev
```

The API will be available at: `http://localhost:8000`

## API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

#### Register
```http
POST /api/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "customer"  // optional: "admin" or "customer" (default: customer)
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}

Response:
{
    "message": "Login successful",
    "user": {...},
    "token": "1|xxxxxxxxxxx"
}
```

#### Logout
```http
POST /api/logout
Authorization: Bearer {token}
```

#### Get Current User
```http
GET /api/me
Authorization: Bearer {token}
```

### Category Endpoints

#### Get All Categories
```http
GET /api/categories
Authorization: Bearer {token}
```

#### Create Category (Admin Only)
```http
POST /api/categories
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "New Category",
    "description": "Category description"
}
```

#### Update Category (Admin Only)
```http
PUT /api/categories/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Updated Category",
    "description": "Updated description"
}
```

#### Delete Category (Admin Only)
```http
DELETE /api/categories/{id}
Authorization: Bearer {token}
```

### Ticket Endpoints

#### Get All Tickets
```http
GET /api/tickets
Authorization: Bearer {token}

Query Parameters:
- status: open|in_progress|resolved|closed
- priority: low|medium|high|urgent
- category_id: integer
```

#### Get Single Ticket
```http
GET /api/tickets/{id}
Authorization: Bearer {token}
```

#### Create Ticket
```http
POST /api/tickets
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
    "category_id": 1,
    "subject": "Issue with login",
    "description": "Detailed description of the issue",
    "priority": "high",
    "attachment": <file>  // optional, max 10MB
}
```

#### Update Ticket
```http
PUT /api/tickets/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "subject": "Updated subject",
    "description": "Updated description",
    "priority": "urgent",
    "status": "in_progress",  // Admin only
    "assigned_to": 2  // Admin only
}
```

#### Delete Ticket
```http
DELETE /api/tickets/{id}
Authorization: Bearer {token}
```

### Comment Endpoints

#### Get Ticket Comments
```http
GET /api/tickets/{ticket_id}/comments
Authorization: Bearer {token}
```

#### Add Comment
```http
POST /api/tickets/{ticket_id}/comments
Authorization: Bearer {token}
Content-Type: application/json

{
    "content": "This is a comment"
}
```

#### Update Comment
```http
PUT /api/comments/{comment_id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "content": "Updated comment"
}
```

#### Delete Comment
```http
DELETE /api/comments/{comment_id}
Authorization: Bearer {token}
```

### Message Endpoints (Real-Time Chat)

#### Get Ticket Messages
```http
GET /api/tickets/{ticket_id}/messages
Authorization: Bearer {token}
```

#### Send Message
```http
POST /api/tickets/{ticket_id}/messages
Authorization: Bearer {token}
Content-Type: application/json

{
    "message": "Hello, how can I help you?"
}

# Real-time broadcast event: "message.sent" on channel "ticket.{ticket_id}"
```

#### Get Unread Count
```http
GET /api/messages/unread-count
Authorization: Bearer {token}
```

## Real-Time Chat Implementation

### Broadcasting Channel Authorization

The system uses private channels for secure real-time communication:

```javascript
// Channel: ticket.{ticketId}
// Authorization: 
// - Admins can access all ticket channels
// - Customers can only access their own ticket channels
```

### Frontend Integration Example (JavaScript)

```javascript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    auth: {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
});

// Listen for new messages
Echo.private(`ticket.${ticketId}`)
    .listen('.message.sent', (e) => {
        console.log('New message:', e);
        // Update UI with new message
    });
```

## Database Schema

### Users Table
- id, name, email, password, role (admin/customer), timestamps

### Categories Table
- id, name, slug, description, timestamps

### Tickets Table
- id, user_id, category_id, assigned_to, subject, description, priority, status, attachment, timestamps

### Comments Table
- id, ticket_id, user_id, content, timestamps

### Messages Table
- id, ticket_id, user_id, message, is_read, timestamps

## Security Features

- Token-based authentication with Sanctum
- Password hashing with bcrypt
- CSRF protection
- SQL injection prevention (Eloquent ORM)
- XSS protection
- Role-based access control
- Private broadcasting channels
- File upload validation
- Request validation

## Testing

### API Testing with Postman

1. Import the API endpoints into Postman
2. Set up an environment variable for the token
3. Test authentication flow
4. Test CRUD operations for tickets, comments, and messages

### Manual Testing Flow

1. Register two users (one admin, one customer)
2. Login as customer and create a ticket
3. Login as admin and view all tickets
4. Assign ticket to admin
5. Add comments from both roles
6. Test real-time chat functionality
7. Test file upload
8. Test authorization (customer accessing other's tickets)

## Project Structure

```
app/
├── Events/
│   └── MessageSent.php          # Broadcasting event for messages
├── Http/
│   └── Controllers/
│       └── Api/
│           ├── AuthController.php       # Authentication
│           ├── CategoryController.php   # Category management
│           ├── CommentController.php    # Comment CRUD
│           ├── MessageController.php    # Real-time messaging
│           └── TicketController.php     # Ticket CRUD
└── Models/
    ├── Category.php
    ├── Comment.php
    ├── Message.php
    ├── Ticket.php
    └── User.php

database/
├── migrations/
│   ├── xxxx_add_role_to_users_table.php
│   ├── xxxx_create_categories_table.php
│   ├── xxxx_create_tickets_table.php
│   ├── xxxx_create_comments_table.php
│   └── xxxx_create_messages_table.php
└── seeders/
    └── DatabaseSeeder.php

routes/
├── api.php          # API routes
└── channels.php     # Broadcasting channels
```

## Git Workflow

### Meaningful Commit Messages

This project follows conventional commit messages:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example:
```bash
git commit -m "feat: add real-time chat functionality"
git commit -m "fix: resolve ticket authorization issue"
git commit -m "docs: update API documentation"
```

## Future Enhancements

- Email notifications for ticket updates
- Ticket escalation system
- Advanced search and filtering
- Ticket analytics dashboard
- File preview for attachments
- Multi-language support
- Mobile app integration
- Automated ticket routing
- SLA (Service Level Agreement) tracking

## Troubleshooting

### Broadcasting not working
- Ensure Reverb server is running: `php artisan reverb:start`
- Check `.env` broadcasting configuration
- Verify channel authorization in `routes/channels.php`

### Database connection error
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists

### File upload fails
- Check `storage/app/public` directory permissions
- Verify `storage:link` has been run
- Check file size (max 10MB)

## Support

For issues and questions, please create an issue in the repository.

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Credits

Built with Laravel 11.x and Laravel Reverb for real-time functionality.
