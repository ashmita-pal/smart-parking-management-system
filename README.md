# ParkSphere --- Smart Parking Management System

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express.js](https://img.shields.io/badge/Express.js-5.x-black)
![React](https://img.shields.io/badge/React-19.x-61DAFB)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![Razorpay](https://img.shields.io/badge/Razorpay-Test%20Mode-3395FF)
![Swagger](https://img.shields.io/badge/API%20Docs-Swagger-85EA2D)
![License](https://img.shields.io/badge/License-MIT-yellow)

**ParkSphere** is a full-stack Smart Parking Management System designed
to digitize parking operations through parking-lot and slot management,
vehicle registration, online booking, secure payments, QR-based entry
and exit, automatic booking expiry, overstay handling, and
administrative analytics.

The project uses a layered Node.js/Express backend with Prisma and
PostgreSQL, together with a React/Vite frontend. The application has
been developed and tested incrementally end-to-end and is now being
prepared for cloud deployment.

---

## 📖 Overview

ParkSphere provides two primary experiences:

- **User Portal** --- users can register, verify their email, manage
  vehicles, discover parking availability, create and manage bookings,
  make payments, and use QR-based parking workflows.
- **Admin Portal** --- administrators can manage parking lots and
  slots, monitor bookings and payments, manage users, perform
  check-in/check-out operations, and view operational analytics.

The backend follows a layered architecture:

```text
Client
  ↓
Routes
  ↓
Middleware
  ↓
Controllers
  ↓
Services
  ↓
Prisma ORM
  ↓
PostgreSQL
```

This separation keeps HTTP handling, authorization, business logic, and
database operations organized and maintainable.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

- User registration
- Email verification using a verification code
- Verification-code resend workflow
- User login
- JWT authentication
- HTTP-only authentication cookies
- Role-Based Access Control (RBAC)
- Ownership-based authorization
- Forgot-password workflow
- Password reset
- Logout
- Current-user retrieval

### 🅿️ Parking Management

- Parking lot CRUD
- Parking slot CRUD
- Slot type management
- Floor-wise slot management
- Real-time slot status management
- Parking lot activation/deactivation
- Soft deletion
- Parking availability search

### 🚗 Vehicle Management

- Vehicle registration
- Vehicle type management
- View user vehicles
- Update vehicle information
- Delete/soft-delete vehicles
- Vehicle ownership validation

### 📅 Booking Management

- Parking availability validation
- Booking creation
- Booking reference generation
- Booking duration and amount calculation
- Booking overlap protection
- Transaction-based booking creation
- Race-condition protection
- Booking cancellation
- Booking history
- Booking details
- Booking expiry
- No-show handling
- Grace-period handling
- Overstay detection
- Overstay billing

### 💳 Payments

- Razorpay order creation
- Razorpay payment signature verification
- Booking payments
- Overstay payments
- Payment history
- Payment status tracking
- Refund-oriented payment architecture
- Transaction-safe booking/payment state updates

> **Razorpay is currently intended to be used in Test Mode during
> deployment and initial production validation. Live payment credentials
> should only be configured when the application is ready to accept real
> payments.**

### 📱 QR Parking Workflow

- Secure QR token generation
- QR code generation
- QR-based check-in
- QR-based check-out
- QR expiry
- Entry-time tracking
- Exit-time tracking
- Automatic slot release after completion

### 👨‍💼 Admin Portal

- Admin dashboard
- Parking lot management
- Parking slot management
- Booking management
- Payment management
- User management
- Check-in/check-out management
- Revenue statistics
- Booking statistics
- Parking performance analytics
- Vehicle distribution analytics

### ⏱️ Automated Booking Lifecycle

A scheduled background job handles expired bookings and no-show
bookings.

The lifecycle includes:

```text
PENDING_PAYMENT
      ↓
Payment completed
      ↓
CONFIRMED
      ↓
Check-in
      ↓
ACTIVE
      ↓
Check-out
      ↓
COMPLETED
```

Expired and no-show bookings are automatically processed by the
booking-expiry scheduler.

---

## 🧩 Backend Modules

### Authentication

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/verify-email
POST   /api/v1/auth/resend-verification
POST   /api/v1/auth/login
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
```

Admin user management is also provided through the authentication
module.

### Parking Lots

```text
POST   /api/v1/parking-lots
GET    /api/v1/parking-lots
GET    /api/v1/parking-lots/:id
PATCH  /api/v1/parking-lots/:id
DELETE /api/v1/parking-lots/:id
```

### Parking Slots

```text
POST   /api/v1/parking-slots
GET    /api/v1/parking-slots
GET    /api/v1/parking-slots/:id
PATCH  /api/v1/parking-slots/:id
PATCH  /api/v1/parking-slots/:id/status
DELETE /api/v1/parking-slots/:id
```

### Vehicles

Vehicle APIs support registration, retrieval, update, and deletion of
user-owned vehicles.

### Bookings

```text
POST   /api/v1/bookings
GET    /api/v1/bookings
GET    /api/v1/bookings/:bookingId
PATCH  /api/v1/bookings/:bookingId/cancel
POST   /api/v1/bookings/check-in
PATCH  /api/v1/bookings/:bookingId/checkout
GET    /api/v1/bookings/:bookingId/gate-status
```

### Payments

Payment APIs support Razorpay order creation, payment verification,
overstay payment processing, and payment history.

### Availability

```text
GET /api/v1/availability
```

The availability service checks parking lots, slots, requested time
ranges, and overlapping active bookings.

### Dashboard

```text
GET /api/v1/dashboard/summary
GET /api/v1/dashboard/bookings
GET /api/v1/dashboard/revenue
```

Dashboard endpoints are protected and available to administrators.

---

## 🏛️ Architecture

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    │     User / Admin     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Express        │
                    │        Routes        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Middleware       │
                    │ JWT / RBAC / Errors  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Controllers      │
                    │ HTTP request/response│
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Services       │
                    │ Business Logic       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Prisma ORM        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     PostgreSQL       │
                    └──────────────────────┘
```

External integrations:

```text
                 ┌───────────────┐
                 │   Razorpay    │
                 └───────┬───────┘
                         │
ParkSphere Backend ──────┼──── Payment
                         │
                 ┌───────▼───────┐
                 │  Nodemailer   │
                 │ / Mailtrap    │
                 └───────────────┘
```

---

## 🗄️ Database

ParkSphere uses PostgreSQL with Prisma ORM.

### Core entities

- Users
- Vehicles
- Parking Lots
- Parking Slots
- Bookings
- Payments

### Major relationships

```text
User
 ├── Vehicles
 └── Bookings

Parking Lot
 ├── Parking Slots
 └── Bookings

Parking Slot
 └── Bookings

Booking
 └── Payments
```

Prisma migrations are used to manage database schema changes.

---

## 🛠️ Technology Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- QRCode React
- HTML5 QR Code

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- Bcrypt
- Cookie Parser
- CORS
- Nodemailer
- Razorpay SDK
- QRCode
- Node Cron
- Swagger / OpenAPI

### External Services

- Razorpay --- payment processing
- Mailtrap / SMTP --- development email delivery
- PostgreSQL --- relational database

---

## 📂 Project Structure

```text
smart-parking-management-system/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── controllers/
│   │   ├── docs/
│   │   ├── helpers/
│   │   ├── jobs/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── templates/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── prisma.config.ts
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── docs/
├── LICENSE
└── README.md
```

---

## ⚙️ Environment Variables

The backend requires the following environment variables:

```env
DATABASE_URL=

JWT_SECRET=
JWT_EXPIRES_IN=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
MAIL_FROM="ParkSphere <no-reply@smartparking.com>"

FRONTEND_URL=
```

### Local development

The frontend development server normally runs on:

```text
http://localhost:5173
```

The backend runs on:

```text
http://localhost:5000
```

Therefore, local development uses:

```env
FRONTEND_URL=http://localhost:5173
```

### Production

Production secrets must be configured through the hosting provider's
environment-variable system.

**Never commit `.env` or production credentials to GitHub.**

---

## 🚀 Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Soumya-0712/smart-parking-management-system.git
cd smart-parking-management-system
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file using the required environment variables.

Then configure the PostgreSQL database and run:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/health
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will normally be available at:

```text
http://localhost:5173
```

---

## 📘 API Documentation

ParkSphere provides interactive Swagger/OpenAPI documentation.

During local development:

```text
http://localhost:5000/api-docs
```

After deployment, the same documentation will be available through the
deployed backend URL.

---

## 🔒 Security

The application includes several security-oriented mechanisms:

- JWT-based authentication
- HTTP-only authentication cookies
- Role-Based Access Control
- Ownership-based authorization
- Password hashing with Bcrypt
- Email verification
- Password reset workflow
- Razorpay signature verification
- Input validation in service/controller workflows
- Soft deletion
- Transaction-based critical database operations
- Booking overlap protection
- Race-condition protection

Secrets such as database credentials, JWT secrets, Razorpay secrets, and
mail credentials are supplied through environment variables.

---

## ⏱️ Booking State Management

Bookings use a controlled lifecycle:

```text
PENDING_PAYMENT
      │
      ├── Payment expires ──► EXPIRED
      │
      ▼
CONFIRMED
      │
      ├── No-show ──────────► EXPIRED
      │
      ▼
ACTIVE
      │
      ├── Normal checkout ──► COMPLETED
      │
      └── Overstay ─────────► OVERSTAY_PAYMENT_PENDING
                                      │
                                      ▼
                                  COMPLETED
```

Parking slot states include:

```text
AVAILABLE
TEMP_RESERVED
RESERVED
OCCUPIED
MAINTENANCE
```

---

## 📊 Admin Analytics

The admin analytics module uses live backend data rather than static
frontend datasets.

Current analytics include:

- Total revenue
- Weekly revenue
- Booking revenue
- Total bookings
- Weekly bookings
- Average booking value
- Daily revenue
- Parking-lot performance
- Parking occupancy
- Vehicle-type distribution
- Revenue and booking insights

---

## 🧪 Testing Status

The application has been tested incrementally while the major modules
were developed.

The current application has been tested across the main user and admin
workflows, including:

- Authentication
- Email verification
- Vehicle management
- Parking lot management
- Parking slot management
- Availability
- Booking lifecycle
- Payment flow
- QR check-in/check-out
- Overstay handling
- Booking expiry
- Admin dashboard
- Admin bookings
- Admin payments
- Admin users
- Admin analytics

Razorpay is currently intended to remain in **Test Mode** during
deployment validation.

---

## 🚀 Deployment

The application is currently being prepared for cloud deployment.

Planned deployment flow:

```text
GitHub
   │
   ├──────────────► React/Vite Frontend
   │
   └──────────────► Node/Express Backend
                           │
                           ├──► PostgreSQL
                           ├──► Razorpay
                           └──► Email Service
```

Production deployment will use environment variables for:

- PostgreSQL connection
- JWT configuration
- Razorpay credentials
- Email configuration
- Frontend URL

The initial deployment will use **Razorpay Test Mode** for validation
before switching to live payment credentials.

---

## 🗺️ Roadmap

### Completed

- [x] Authentication & Authorization
- [x] Email Verification
- [x] Password Recovery
- [x] Vehicle Management
- [x] Parking Lot Management
- [x] Parking Slot Management
- [x] Parking Availability
- [x] Booking Lifecycle
- [x] Booking Expiry Scheduler
- [x] Overstay Management
- [x] Razorpay Integration
- [x] QR-Based Check-In
- [x] QR-Based Check-Out
- [x] User Portal
- [x] Admin Dashboard
- [x] Admin Parking Management
- [x] Admin Booking Management
- [x] Admin Payment Management
- [x] Admin User Management
- [x] Admin Analytics
- [x] Swagger Documentation
- [x] End-to-End Application Testing

### Planned / Future

- [ ] Production cloud deployment
- [ ] Production Razorpay live-mode configuration
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Real-time slot updates using WebSockets
- [ ] Google Maps integration
- [ ] Advanced monitoring and observability
- [ ] Horizontal scaling / load balancing

---

## 📌 Current Project Status

**Status: Application Complete --- Deployment Phase 🚀**

The core ParkSphere application has been implemented across both the
backend and frontend, and the major workflows have been tested
end-to-end.

The current focus is deployment and production configuration.

---

## 👥 Contributor

- **Soumyadeep Paul**

---

## 📄 License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for details.
