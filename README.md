# Smart Parking Management System

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express.js](https://img.shields.io/badge/Express.js-5.x-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![License](https://img.shields.io/badge/License-MIT-yellow)

A full-stack Smart Parking Management System designed to streamline urban parking through real-time slot management, secure vehicle registration, online booking, digital payments, and QR code-based entry and exit.

The project is being developed with a scalable backend architecture using Node.js, Express.js, Prisma ORM, and PostgreSQL, following production-oriented development practices.

## 📖 Overview

The Smart Parking Management System is a production-oriented backend application designed to digitize parking operations. It supports secure user authentication, vehicle management, online booking, Razorpay payment integration, QR code-based vehicle entry and exit, automatic booking expiry, and intelligent overstay handling.

The project follows a layered architecture and emphasizes scalability, security, and maintainability using modern backend development practices.

## ✨ Features

### ✅ Implemented

#### Authentication & Authorization

- User Registration
- User Login
- JWT Authentication
- Role-Based Access Control (RBAC)
- Ownership-Based Authorization

#### Parking Management

- Parking Lot CRUD
- Parking Slot CRUD
- Vehicle Management
- Real-Time Slot Status Management

#### Booking Management

- Create Booking
- Get Booking Details
- Cancel Booking
- Transaction-Based Booking Creation
- Race Condition Protection
- Automatic Booking Expiry
- QR-Based Booking Confirmation

#### Payment System

- Razorpay Order Creation
- Secure Payment Verification
- Multi-Payment Architecture
- Booking Payments
- Overstay Payments

#### Smart Parking Workflow

- QR Token Generation
- QR Code Generation
- QR-Based Check-In
- QR-Based Check-Out
- Grace Period Support
- Automatic Overstay Calculation
- Automatic Slot Release

### 🚀 Future Enhancements

- Booking History
- Dashboard Analytics
- Revenue Reports
- Google Maps Integration
- Real-Time Slot Availability (WebSockets)
- Email Notifications
- Admin Dashboard
- React Frontend
- Docker Deployment
- CI/CD Pipeline

## 🚀 Production Features

- Layered Architecture (Routes → Controllers → Services → Database)
- Transaction-Based Database Operations
- Race Condition Protection
- Soft Delete Strategy
- Ownership-Based Authorization
- QR-Based Secure Check-In
- Automatic Booking Expiry Scheduler
- Grace Period & Overstay Handling
- Multi-Payment Architecture
- Secure Razorpay Signature Verification
- Modular Service Design

## ⚙️ Installation

```bash
git clone <repository-url>

cd Smart-Parking-Management-System/backend

npm install

cp .env.example .env

npx prisma migrate dev

npm run dev
```

After copying `.env.example` to `.env`, fill in your own values (database credentials, JWT secret, Razorpay keys, etc.) before starting the server.

## 📂 Project Structure

```text
backend/
├── node_modules/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── config/
│   │   ├── prisma.js
│   │   └── razorpay.js
│   ├── constants/
│   ├── controllers/
│   ├── jobs/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
├── prisma.config.ts
└── tsconfig.json
docs/
frontend/
.gitignore
LICENSE
README.md
```

> **Note:** `.env` holds real secrets and is git-ignored — never commit it. `.env.example` lists the required variable names with empty/placeholder values so anyone cloning the repo knows what to configure.

## 🏛 Architecture

```text
            Client
               │
               ▼
        Express Routes
               │
               ▼
         Controllers
               │
               ▼
           Services
               │
               ▼
          Prisma ORM
               │
               ▼
          PostgreSQL
```

## 🗄 Database Design

Core Entities

- Users
- Vehicles
- Parking Lots
- Parking Slots
- Bookings
- Payments

Relationships

- One User → Many Vehicles
- One User → Many Bookings
- One Parking Lot → Many Slots
- One Booking → Multiple Payments

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
- PostgreSQL
- JWT Authentication
- Bcrypt
- Razorpay SDK
- QRCode
- Node Cron

### External Services

- Razorpay
- Google Maps API (Planned)

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
- QR Check-In
- QR Check-Out
- Grace Period Handling
- Overstay Calculation
- Transaction-Based Booking Processing
- Race Condition Protection
- Automatic Booking Expiry

### Payments

- Create Booking Payment
- Verify Booking Payment
- Create Overstay Payment
- Verify Overstay Payment
- Multi-Payment Support
- Razorpay Integration

## 🚧 Project Status

**Current Phase:** Backend Development (Core Backend Completed)

The core backend modules have been implemented, including authentication, booking lifecycle, QR-based check-in/check-out, payment processing, automatic booking expiry, and overstay management.

The next phase focuses on administrative features, analytics, frontend development, and deployment.

### Completed Modules

- Authentication & Authorization
- Parking Lot Management
- Parking Slot Management
- Vehicle Management
- Booking Lifecycle
- Payment System
- QR Check-In
- QR Check-Out
- Booking Expiry Scheduler
- Overstay Management

### Currently Working On

- Admin Dashboard APIs
- Booking Analytics

### 📌 Upcoming Modules

#### Backend

- Admin Dashboard APIs
- Booking History & Pagination
- Analytics & Revenue Reports
- Google Maps Integration
- Real-Time Slot Availability (WebSockets)

#### Frontend

- React.js User Portal
- React.js Admin Dashboard

#### DevOps

- Docker Containerization
- CI/CD Pipeline
- Cloud Deployment

## 🚀 Roadmap

- [x] Authentication & Authorization
- [x] Parking Lot Management
- [x] Parking Slot Management
- [x] Vehicle Management
- [x] Booking Lifecycle
- [x] Razorpay Integration
- [x] QR-Based Check-In
- [x] QR-Based Check-Out
- [x] Booking Expiry Scheduler
- [x] Overstay Management

- [ ] Booking History
- [ ] Dashboard Analytics
- [ ] Google Maps Integration
- [ ] Real-Time Slot Availability
- [ ] Email Notifications
- [ ] Admin Dashboard
- [ ] React Frontend
- [ ] Docker Deployment
- [ ] CI/CD Pipeline
- [ ] Production Deployment
