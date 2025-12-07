# Beauty Salon Appointment System

A comprehensive appointment management system for beauty salons with customer management and calendar features.

## Features

- Admin authentication
- Customer management (CRUD operations)
- Appointment scheduling with calendar view
- Responsive design with feminine color scheme

## Tech Stack

- React (Vite)
- Firebase (Authentication & Firestore)
- Tailwind CSS

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at https://console.firebase.google.com/
   - Copy your Firebase configuration
   - Create a `.env` file in the root directory with your Firebase credentials:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. Run the development server:
   ```
   npm run dev
   ```

## Usage

1. Log in with your admin credentials
2. Manage customers in the "Customers" section
3. Schedule and manage appointments in the "Appointments" section
4. View dashboard statistics on the home page

## Project Structure

```
src/
├── components/     # Reusable UI components
├── firebase/       # Firebase configuration and initialization
├── services/       # Business logic for customers and appointments
├── App.jsx         # Main application component
└── main.jsx        # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build# beauty-center-manager
