# HealthTick Calendar System

A modern web application built for HealthTick to schedule and manage client calls (onboarding and follow-up) with a clean, responsive interface.

## Features

- **Daily Calendar View**: Navigate through dates with 20-minute time slots from 10:30 AM to 7:30 PM
- **Two Call Types**:
  - Onboarding calls: 40 minutes, one-time
  - Follow-up calls: 20 minutes, weekly recurring
- **Smart Scheduling**: Prevents overlapping bookings based on call duration
- **Client Management**: Searchable dropdown with 20 dummy clients
- **Recurring Logic**: Follow-up calls automatically repeat weekly
- **Real-time Updates**: Instant UI updates with Firebase Firestore backend
- **Responsive Design**: Modern, polished UI built with Tailwind CSS

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Firebase Firestore
- **Libraries**: 
  - `react-datepicker` for date selection
  - `date-fns` for date manipulation
  - `firebase` for backend services

## Project Structure

```
src/
├── components/
│   ├── Calendar.tsx          # Main calendar component
│   ├── TimeSlot.tsx          # Individual time slot component
│   ├── BookingCard.tsx       # Booked appointment display
│   └── ClientSelector.tsx    # Client search and selection modal
├── services/
│   ├── firebase.ts           # Firebase configuration
│   └── bookings.ts           # Booking CRUD operations
├── types/
│   └── index.ts              # TypeScript interfaces
├── data/
│   └── clients.ts            # 20 dummy clients
├── styles/
│   └── index.css             # Tailwind CSS imports
├── App.tsx                   # Main application component
└── main.tsx                  # Application entry point
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore enabled

## How to Run the Application

### Quick Start

1. **Prerequisites Check**
   ```bash
   node --version  # Should be 18+
   npm --version   # Should be 8+
   ```

2. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd healthtick-calendar
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173` with hot-reload enabled.

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build optimized production bundle |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run preview` | Preview production build locally |

### Environment Setup

The application works out-of-the-box with the included Firebase configuration. For your own Firebase project:

1. Create a new Firebase project at `https://console.firebase.google.com`
2. Enable Firestore database
3. Update `src/services/firebase.ts` with your configuration
4. (Optional) Set environment variables for production deployment

### Development Workflow

1. **File Watching**: Vite automatically reloads on file changes
2. **TypeScript**: Real-time type checking in development
3. **Tailwind CSS**: Instant styling updates with JIT compilation
4. **Firebase**: Live connection to Firestore database

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## Firestore Schema

The application uses Firebase Firestore as its backend database with a simple, efficient schema design.

### Collection: `bookings`

Each booking document represents either a one-time onboarding call or a recurring follow-up call.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `clientId` | string | Yes | Reference to client ID from dummy data |
| `type` | string | Yes | "onboarding" or "follow-up" |
| `date` | string | Yes | Date in YYYY-MM-DD format |
| `time` | string | Yes | Time in HH:mm format (24-hour) |
| `isRecurring` | boolean | Yes | True for follow-up calls (weekly recurring) |

### Document ID Structure

- Documents use auto-generated Firestore IDs for uniqueness
- No custom ID patterns needed due to simple schema design

### Indexes

Firestore automatically creates indexes for:
- Single field queries (date, time, type)
- Composite queries are handled by client-side filtering

### Example Document

```json
{
  "id": "auto-generated-firestore-id",
  "clientId": "client-1",
  "type": "follow-up",
  "date": "2025-08-01",
  "time": "14:30",
  "isRecurring": true
}
```

### Data Relationships

- **Clients**: Currently stored as dummy data in `src/data/clients.ts`
- **Bookings**: Referenced to clients via `clientId` field
- **Recurring Logic**: Single document with `isRecurring: true` represents all weekly occurrences

## Key Features Explained

### Time Slot Management

- **Slots**: 20-minute intervals from 10:30 AM to 7:30 PM
- **Overlap Prevention**: System checks call duration against existing bookings
- **Visual Feedback**: Available slots are blue, conflicts are red, booked slots show client info

### Recurring Follow-up Calls

- Follow-up calls automatically repeat weekly on the same day/time
- Single Firestore record with `isRecurring: true`
- Dynamically calculated for any selected date using `date-fns`

### Client Search

- Real-time filtering by name or phone number
- Modal interface with smooth animations
- 20 pre-configured dummy clients

## Business Logic

### Booking Rules

1. **No Overlaps**: System prevents scheduling conflicts
   - Onboarding (40 min) + existing booking at 11:30 AM = blocks 11:10 AM slot
   - Follow-up (20 min) + existing booking at 2:10 PM = blocks 2:00 PM slot

2. **Recurring Logic**: 
   - Follow-up calls repeat weekly on same weekday
   - Example: Thursday 3:50 PM follow-up appears every Thursday

3. **Time Validation**:
   - Only allows booking within operating hours (10:30 AM - 7:30 PM)
   - Prevents booking past 7:30 PM based on call duration

## Deployment

### Vercel (Recommended)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Configure Environment Variables**
   
   Add Firebase configuration in Vercel dashboard under Environment Variables.

### Netlify

1. **Build command**: `npm run build`
2. **Publish directory**: `dist`
3. **Add environment variables** for Firebase configuration

## Assumptions & Design Decisions

### Time Management
- **Operating Hours**: 10:30 AM to 7:30 PM (configurable in `Calendar.tsx`)
- **Time Slots**: 20-minute intervals to match follow-up call duration
- **Timezone**: Application uses local browser timezone (no UTC conversion)
- **Date Range**: No restrictions on future/past dates (can be extended)

### Business Logic
- **Single Coach**: Designed for one coach's schedule (no multi-user support)
- **Call Durations**: 
  - Onboarding: 40 minutes (one-time)
  - Follow-up: 20 minutes (weekly recurring)
- **Overlap Prevention**: System prevents any time conflicts based on call duration
- **Recurring Pattern**: Follow-up calls repeat weekly on the same weekday/time

### Client Management
- **Data Source**: 20 hardcoded dummy clients in `src/data/clients.ts`
- **Search**: Real-time filtering by name or phone number
- **Persistence**: Clients are not stored in Firebase (easily changeable)

### User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Color Scheme**: Custom HealthTick green (#507626) with professional styling
- **Notifications**: Modern toast notifications instead of browser alerts
- **Loading States**: Visual feedback during all async operations

### Technical Assumptions
- **Modern Browsers**: ES6+ support, no IE compatibility
- **Internet Connection**: Required for Firebase operations (no offline mode)
- **Local Storage**: Not used for data persistence (all data in Firestore)
- **Authentication**: No user authentication required (public access)

### Data Integrity
- **Conflict Resolution**: Last write wins (no complex merge strategies)
- **Validation**: Client-side validation only (no server-side rules)
- **Error Handling**: User-friendly messages with console logging for debugging

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

### Code Quality

- **TypeScript**: Full type safety with interfaces
- **ESLint**: Code linting with React/TypeScript rules
- **Modular Architecture**: Separated concerns (components, services, types)
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during async operations


