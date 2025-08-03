# ExcelBD - Courier Service Management System

This is a full-stack web application for a courier service company, designed to manage parcel bookings, tracking, and user roles. The project is built with a React frontend and a Node.js/Express backend.

## Overview

The application provides a platform for customers to book parcel deliveries, for agents to manage these deliveries, and for administrators to oversee the entire system. It features real-time updates, user authentication, and role-based access control.

## Features

*   **User Authentication:** Secure login and registration for customers, agents, and admins.
*   **Role-Based Access Control:**
    *   **Customers:** Can book new parcels, view their booking history, and track their parcels.
    *   **Agents:** Can view assigned parcels, update delivery statuses, and manage their workload.
    *   **Admins:** Have full access to the system, including managing users (agents and customers) and all parcel bookings.
*   **Parcel Booking:** A multi-step form for customers to provide sender, receiver, and parcel details.
*   **Real-time Tracking:** Real-time notifications and status updates for parcels using Socket.IO.
*   **Dashboard:** A comprehensive dashboard for admins and agents to view statistics and manage operations.

## Tech Stack

**Frontend:**

*   **Framework:** React
*   **UI Library:** Material-UI (MUI)
*   **State Management:** Redux
*   **Routing:** React Router
*   **HTTP Client:** Axios
*   **Real-time Communication:** Socket.IO Client

**Backend:**

*   **Framework:** Node.js, Express.js
*   **Language:** TypeScript
*   **Database:** MongoDB with Mongoose ODM
*   **Authentication:** JSON Web Tokens (JWT)
*   **Real-time Communication:** Socket.IO

## Project Structure

The project is organized into two main directories:

-   `frontend/`: Contains the React application.
-   `backend/`: Contains the Node.js/Express server application.

```
excelbd/
├── frontend/      # React App
└── backend/       # Node.js/Express Server
```

## Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   npm
*   MongoDB (local or a cloud instance like MongoDB Atlas)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `backend` root directory and add the following environment variables. Replace the placeholder values with your actual configuration.
    ```
    PORT=5000
    MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>
    JWT_SECRET=<YOUR_JWT_SECRET>
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The server will start on the port specified in your `.env` file (e.g., `http://localhost:5000`).

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm start
    ```
    The React application will open in your browser at `http://localhost:3000`.

## Available Scripts

### Backend (`/backend`)

*   `npm run dev`: Starts the server in development mode with hot-reloading using `nodemon` and `ts-node`.
*   `npm run build`: Compiles the TypeScript code to JavaScript.
*   `npm run start`: Starts the production server from the compiled code.
*   `npm run lint`: Lints the TypeScript code.
*   `npm run format`: Formats the code using Prettier.

### Frontend (`/frontend`)

*   `npm start`: Runs the app in development mode.
*   `npm run build`: Builds the app for production.
*   `npm test`: Runs the test suite.