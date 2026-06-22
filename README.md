# Full Stack Apartment Booking App

This project is a full-stack apartment booking application with a React frontend and a Node/Express backend.

## Project Structure

- `client/` - React app using TypeScript, Vite, and Material UI
- `server/` - Node.js server using Express and MongoDB
- Booking interface, property management, authentication, and apartment listings with images

## Technologies

- React 19, TypeScript, Vite
- Redux Toolkit
- Material UI
- Node.js, Express
- MongoDB, Mongoose
- JWT authentication
- Multer for image uploads

## Installation and Run

1. Install dependencies for the client:
   ```bash
   cd client
   npm install
   ```

2. Install dependencies for the server:
   ```bash
   cd ../server
   npm install
   ```

3. Create a `.env` file in `server/` with environment variables like:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   cd server
   node app.js
   ```

5. Start the client:
   ```bash
   cd client
   npm run dev
   ```

## Features

- Login and registration screens
- User and owner authorization
- Apartment management (create, edit, delete)
- Full apartment details with image gallery
- Booking calendar
- Personal and admin bookings views

## Why This Project Is Great for a Resume

This project demonstrates experience with:

- Building a complete full-stack application
- React and Redux with a REST API backend
- Authentication using JWT
- Modern UI using Material UI
- Data persistence with MongoDB

## Recommended Repository Name

For a resume and portfolio, use a professional repository name such as:
- `apartment-booking-app`
- `full-stack-apartment-booking`
- `rental-booking-platform`

If you want, I can also help rename the repo and update the project details for a more polished portfolio presentation.
