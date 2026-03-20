# Premium Hostel Booking Platform

A clean, scalable, production-ready full-stack MERN application for hostel bookings, specifically designed for Poornima University.

## Features

- **No Authentication yet**: Users are mocked as `@poornima.edu.in` temporarily.
- **One Booking Per User**: Enforced on the backend.
- **Room Categories**: Single, Double, Triple.
- **Occupancy Management**: Prevents overbooking. Real-time capacity checks.
- **Admin Dashboard**: Manage rooms, view all bookings, force cancel bookings.
- **User Dashboard**: Book a room, view active booking, cancel booking.
- **Premium UI**: Black & white high-contrast theme via TailwindCSS, smooth micro-interactions via Framer Motion. 

## Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, React Router DOM, Axios, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)

---

## 🚀 Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port `27017`

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed the database with dummy rooms:
   ```bash
   node seed.js
   ```
   *(Wait until you see "Dummy rooms seeded successfully!" and it exits)*
4. Start the backend server:
   ```bash
   npm run dev
   # or
   npx nodemon server.js
   ```
   The server will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a **new** terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:5173`.

---

## Folder Structure

```
hostel-booking/
├── backend/
│   ├── models/           # Mongoose schemas (Room, Booking)
│   ├── routes/           # Express API routes
│   ├── server.js         # Entry point
│   ├── seed.js           # Dummy data generator
│   └── .env              # Environment vars
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI (Navbar, RoomCard)
│   │   ├── pages/        # Views (Landing, RoomListing, Dashboard, etc.)
│   │   ├── App.jsx       # Routing
│   │   └── index.css     # Global Tailwind styles
│   └── tailwind.config.js
```
