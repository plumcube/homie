# Homie - Find Your Home (Next.js Web App)

A responsive web application for finding apartments, houses, and roommates. This is a Next.js conversion of the original Expo React Native app.

## Features

- 🔍 **Search & Filter**: Search by location, amenities, and filter by price, bedrooms, property type
- 🗺️ **Map View**: Interactive map with property markers (placeholder for now)
- ❤️ **Saved Listings**: Save your favorite properties
- ➕ **Post Listings**: Add new rental listings
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices

## Quick Start

```bash
npm install
npm run dev
```

The app will be available at http://localhost:8000

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Responsive styling
- **Context API** - State management
- **Local Storage** - Persistent saved listings

## Pages

- `/` - Search and browse listings
- `/map` - Map view with property markers
- `/saved` - Your saved favorite listings
- `/post` - Post a new rental listing

## Responsive Features

- **Desktop**: Full navigation bar and multi-column grid layout
- **Mobile**: Bottom tab navigation and single-column layout
- **Tablet**: Optimized grid layouts for medium screens

## Development Notes

- The map functionality currently uses a placeholder. In production, you would integrate with Google Maps, Mapbox, or similar mapping service.
- Images are currently using placeholder URLs. In production, you would implement proper image upload and storage.
- State is managed using React Context with localStorage persistence for saved listings.

## Converting from Expo

This app was converted from a React Native Expo app to a responsive Next.js web app. Key changes:

1. Replaced React Native components with standard HTML/React components
2. Converted StyleSheet to Tailwind CSS classes
3. Replaced React Navigation with Next.js App Router
4. Replaced AsyncStorage with localStorage
5. Added responsive design breakpoints
6. Implemented web-friendly navigation patterns
