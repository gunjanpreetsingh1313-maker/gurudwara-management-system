# Gurudwara Management System

A full-stack Gurudwara Management Website built with React.js, Node.js, Express, and MongoDB.

## Features

- **Public Website**: Home, History, Events, Gallery, Donations, Committee, Contact
- **Admin Panel**: Secure JWT authentication with role-based access
- **Financial Management**: Income, Expenses, Budget, Dashboard with charts
- **Reports**: Daily/Weekly/Monthly/Yearly/Custom reports with PDF, Excel, CSV export
- **Content Management**: History, Events, Gallery, Announcements, Committee, Hukamnama

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React.js, React Router, Axios, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js, JWT, bcrypt, Multer |
| Database | MongoDB with Mongoose |

## Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### MongoDB on Windows

If MongoDB is not installed:

1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) or use MongoDB Atlas (free tier).
2. For local install, start the service:
   ```powershell
   net start MongoDB
   ```
3. For Atlas, update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/gurudwara_management
   ```

## Setup

### 1. Clone and install

```bash
cd backend
npm install
cp .env.example .env   # Edit MONGODB_URI and JWT_SECRET

cd ../frontend
npm install
```

### 2. Seed the database

```bash
cd backend
npm run seed
```

Default admin credentials:
- **Email:** admin@gurudwara.org
- **Password:** admin123

### 3. Run the application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:3000/admin/login

## API Endpoints

| Route | Description |
|-------|-------------|
| `/api/auth` | Register, Login, Users |
| `/api/history` | Gurudwara history CRUD |
| `/api/donations` | Donation records |
| `/api/income` | Income management |
| `/api/expenses` | Expense management |
| `/api/budget` | Monthly budget |
| `/api/dashboard` | Stats & charts |
| `/api/reports` | Report generation & export |
| `/api/events` | Events CRUD |
| `/api/gallery` | Gallery CRUD |
| `/api/announcements` | Announcements CRUD |
| `/api/committee` | Committee members CRUD |
| `/api/contact` | Contact info & feedback |
| `/api/hukamnama` | Daily Hukamnama |

## Color Palette

- **Saffron:** #FF9933
- **Navy Blue:** #1B2A4A
- **Cream:** #FFF8F0
- **Gold:** #D4A017

## Project Structure

```
gurudwara-management-system/
├── backend/
│   ├── config/         # Database config
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth & upload
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── uploads/        # Uploaded files
│   └── server.js
├── frontend/
│   ├── public/images/  # Static images
│   └── src/
│       ├── components/ # Reusable UI
│       ├── context/    # Auth context
│       ├── pages/      # Public & admin pages
│       └── services/   # API client
└── README.md
```

## License

MIT
