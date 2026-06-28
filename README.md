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
- Ownership-Based Authorization
- Soft Delete Support

### 🚧 In Progress

- Booking Management

### 📌 Planned

- Online Slot Booking
- Razorpay Payment Gateway
- QR Code Based Entry & Exit
- Google Maps Integration
- Booking History
- Admin Dashboard
- Real-Time Slot Availability

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

- Coming Soon

## 🚧 Project Status

**Current Phase:** Backend Development (Phase 1)

The backend is being developed module-by-module following production-grade architecture and best practices.

### ✅ Completed Modules

- Authentication & Authorization (JWT)
- Role-Based Access Control (RBAC)
- Parking Lot Management
- Parking Slot Management
- Vehicle Management

### 🔄 Currently Working On

- Booking Management

### 📌 Upcoming Modules

- Payment Integration (Razorpay)
- QR Code Entry & Exit
- Google Maps Integration
- Real-time Slot Availability
- Analytics Dashboard
- Frontend Development

## 🚀 Roadmap

- [x] Authentication & Authorization
- [x] Parking Lot Management
- [x] Parking Slot Management
- [x] Vehicle Management
- [ ] Booking Management
- [ ] Payment Integration
- [ ] QR Code Entry & Exit
- [ ] Google Maps Integration
- [ ] Admin Dashboard
- [ ] Frontend Development
- [ ] Deployment
