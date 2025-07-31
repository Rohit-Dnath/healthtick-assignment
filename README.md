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

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd healthtick-calendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Update `src/services/firebase.ts` with your Firebase configuration:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## Firestore Schema

### Collection: `bookings`

| Field | Type | Description |
|-------|------|-------------|
| `clientId` | string | Reference to client ID |
| `type` | string | "onboarding" or "follow-up" |
| `date` | string | Date in YYYY-MM-DD format |
| `time` | string | Time in HH:mm format (24-hour) |
| `isRecurring` | boolean | True for follow-up calls (weekly recurring) |

### Example Document

```json
{
  "clientId": "client-1",
  "type": "follow-up",
  "date": "2025-08-01",
  "time": "14:30",
  "isRecurring": true
}
```

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

## Assumptions & Limitations

- **Operating Hours**: 10:30 AM to 7:30 PM (configurable in code)
- **Time Slots**: 20-minute intervals (matching follow-up duration)
- **Clients**: 20 hardcoded dummy clients (easily replaceable with Firebase collection)
- **Timezone**: Local timezone (can be extended for multiple timezones)
- **Single Coach**: Designed for one coach's schedule (can be extended for multiple coaches)

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

## Future Enhancements

- [ ] Multiple coach support
- [ ] Email/SMS notifications
- [ ] Calendar export (ICS)
- [ ] Client notes and history
- [ ] Advanced recurring patterns
- [ ] Timezone support
- [ ] Mobile app
- [ ] Integration with external calendars

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
