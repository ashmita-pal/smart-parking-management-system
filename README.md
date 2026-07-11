# Smart Parking Management System

A full-stack Smart Parking Management System designed to streamline urban parking through real-time slot management, secure vehicle registration, online booking, digital payments, and QR code-based entry and exit.

The project is being developed with a scalable backend architecture using Node.js, Express.js, Prisma ORM, and PostgreSQL, following production-oriented development practices.

## ✨ Features



### ✅ Implemented

- User Registration & Login
- JWT Authentication
- Role-Based Access Control (RBAC)
- Parking Lot CRUD Operations
- Parking Slot CRUD Operations
- Vehicle Management
- Booking Management
- Ownership-Based Authorization
- Transaction-Based Booking Processing
- Race Condition Protection
- Soft Delete Support
- Razorpay Payment Order Creation
- Payment Verification
- QR Code Generation
- Automatic Booking Expiry

### 🚧 In Progress

- Payment Integration (Razorpay)

### 📌 Planned

### 📌 Planned

- Razorpay Payment Integration
- Automatic Booking Expiry (Cron Jobs)
- QR Code Generation
- QR Code Based Entry & Exit
- Booking History & Analytics
- Google Maps Integration
- Real-Time Slot Availability
- Admin Dashboard

## 🛠 Tech Stack

### Frontend (Planned)

- React.js
- Vite
- Axios
- Socket.IO Client

### Backend

- Node.js
- Express.js
- Prisma ORM
- JWT Authentication
- Bcrypt

### Database

- PostgreSQL

### External Services (Planned)

- Razorpay
- Google Maps API

## 🏗 Development Principles

- Layered Architecture (Routes → Controllers → Services → Database)
- RESTful API Design
- JWT Authentication
- Role-Based Access Control (RBAC)
- Ownership-Based Authorization
- Soft Delete Strategy
- Prisma ORM
- Modular Code Organization
- Error Handling with Custom API Responses

## 📦 Backend Modules

### Authentication

- Register
- Login
- Logout
- Get Current User

### Parking Lots

- Create Parking Lot
- Get Parking Lots
- Get Parking Lot by ID
- Update Parking Lot
- Soft Delete Parking Lot

### Parking Slots

- Create Parking Slot
- Get Parking Slots
- Get Parking Slot by ID
- Update Parking Slot
- Update Slot Status
- Soft Delete Parking Slot

### Vehicles

- Register Vehicle
- Get My Vehicles
- Get Vehicle by ID
- Update Vehicle
- Soft Delete Vehicle

### Bookings

- Create Booking
- Get My Bookings
- Get Booking by ID
- Cancel Booking
- Transaction-Based Booking Creation
- Race Condition Protection

### Payments

- Create Razorpay Order
- Verify Razorpay Payment
- Generate Booking QR Code

## 🚧 Project Status

**Current Phase:** Backend Development (Phase 1)

The backend is being developed module-by-module following production-grade architecture and best practices.

### ✅ Completed Modules

- Authentication & Authorization (JWT)
- Role-Based Access Control (RBAC)
- Parking Lot Management
- Parking Slot Management
- Vehicle Management
- Booking Management (Core)
- Payment Integration
- Automatic Booking Expiry

### 🔄 Currently Working On

- QR Check-In & Check-Out

### 📌 Upcoming Modules

- QR Check-In
- QR Check-Out
- Google Maps Integration
- Real-Time Slot Availability
- Analytics Dashboard
- Frontend Development

## 🚀 Roadmap

- [x] Authentication & Authorization
- [x] Parking Lot Management
- [x] Parking Slot Management
- [x] Vehicle Management
- [x] Booking Management
- [x] Payment Integration
- [ ] QR Code Entry & Exit
- [ ] Google Maps Integration
- [ ] Admin Dashboard
- [ ] Frontend Development
- [ ] Deployment
