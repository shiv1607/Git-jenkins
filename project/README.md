# FestOrg Frontend

A modern React TypeScript frontend for the FestOrg festival management system.

## Features

- **Multi-role Authentication**: Admin, College, and Student roles with secure login/registration
- **Festival Management**: Browse public festivals, view details, and manage programs
- **Program Booking**: Integrated payment system with Razorpay for program registrations
- **Role-based Dashboards**: Customized interfaces for each user type
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Real-time Status**: Backend connection monitoring and graceful error handling

## Prerequisites

Before running the frontend, ensure you have:

1. **Backend Server**: Your Spring Boot application running on `http://localhost:3048`
2. **Node.js**: Version 16 or higher
3. **Database**: MySQL database configured and connected to your backend

## Backend Setup Required

Make sure your Spring Boot backend is running with these endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/public/fests` - Public festival listings
- `POST /api/students/register` - Student registration
- `POST /api/colleges` - College registration
- `POST /api/admins/create` - Admin creation
- And all other endpoints as defined in your controllers

## Backend Fixes Applied

The following backend issues have been identified and need to be fixed:

### 1. **Add Default Constructors to Entities**

Add no-argument constructors to your entities:

```java
// In Admin.java
public Admin() {
    super();
}

// In Review.java  
public Review() {
    super();
}
```

### 2. **Fix Database Column Size for Program Description**

Update your `Program` entity:

```java
@Column(name = "description", columnDefinition = "TEXT")
private String description;
```

Or run this SQL command:
```sql
ALTER TABLE programs MODIFY description TEXT;
```

### 3. **Ensure All Entities Have @NoArgsConstructor**

Make sure all your JPA entities have either:
- `@NoArgsConstructor` annotation (if using Lombok)
- Or a public no-argument constructor

## Getting Started

1. **Fix your backend entities** (see Backend Fixes above)
2. **Start your Spring Boot backend** on port 3048
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

## Backend Connection Status

The frontend includes a backend status indicator in the top-right corner:
- **Green**: Backend is connected and working
- **Red**: Backend is offline or unreachable

When the backend is offline, the app will show demo data for development purposes.

## User Roles & Features

### Admin Dashboard
- Approve/reject festival submissions
- View all pending and approved festivals
- Manage system-wide settings

### College Dashboard
- Create and manage festivals
- Add programs to festivals
- View booking statistics

### Student Dashboard
- Browse available festivals
- Register for programs
- Make payments via Razorpay
- View booking history
- Leave reviews

## Payment Integration

The app integrates with Razorpay for secure payments. Make sure your backend has the correct Razorpay credentials configured.

## Development Notes

- The app uses demo data when the backend is unavailable
- All API calls include proper error handling
- The UI is fully responsive and works on all device sizes
- Modern design with smooth animations and micro-interactions

## Troubleshooting

### Backend Issues

If you see "Backend Offline" status:
1. Ensure your Spring Boot application is running on port 3048
2. Check that your database is connected
3. Verify CORS configuration allows requests from `http://localhost:5173`
4. Check the browser console for specific error messages

### Common Backend Errors

1. **"No default constructor for entity"**:
   - Add `@NoArgsConstructor` to your entities or public no-arg constructors

2. **"Data too long for column 'description'"**:
   - Change description column to TEXT type in database

3. **401 Unauthorized on login**:
   - Check if user exists in database
   - Verify password encoding is working correctly

### Payment Issues

If payment is not working:
1. Check browser console for JavaScript errors
2. Verify Razorpay script is loaded
3. Check network tab for API call failures
4. Ensure Razorpay keys are correct in backend configuration

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Vite** for build tooling
- **Razorpay** for payment processing

## UI Enhancements

The frontend now includes:
- **Glass morphism effects** with backdrop blur
- **Animated backgrounds** with floating elements
- **Enhanced form styling** with better focus states
- **Improved button designs** with hover animations
- **Better error handling** with animated error messages
- **Responsive design** optimized for all screen sizes