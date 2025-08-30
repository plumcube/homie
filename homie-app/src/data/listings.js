export const listings = [
  {
    id: '1',
    title: 'Cozy Downtown Apartment',
    address: '123 Main St, Downtown',
    price: 1500,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 850,
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194
    },
    images: ['https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Apt+1'],
    description: 'Beautiful apartment in the heart of downtown. Close to public transportation and restaurants.',
    amenities: ['Laundry in unit', 'Parking', 'Pet friendly'],
    datePosted: '2024-08-25',
    type: 'apartment',
    lookingForRoommate: false
  },
  {
    id: '2',
    title: 'Spacious House with Garden',
    address: '456 Oak Ave, Suburb',
    price: 2200,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1200,
    coordinates: {
      latitude: 37.7849,
      longitude: -122.4094
    },
    images: ['https://via.placeholder.com/300x200/50C878/FFFFFF?text=House+1'],
    description: 'Large house with private garden. Perfect for families or roommates.',
    amenities: ['Garden', 'Garage', 'Dishwasher'],
    datePosted: '2024-08-28',
    type: 'house',
    lookingForRoommate: true
  },
  {
    id: '3',
    title: 'Modern Studio Loft',
    address: '789 Industrial Blvd, Arts District',
    price: 1800,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 600,
    coordinates: {
      latitude: 37.7649,
      longitude: -122.4294
    },
    images: ['https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Loft+1'],
    description: 'Trendy loft in the arts district with high ceilings and exposed brick.',
    amenities: ['High ceilings', 'Exposed brick', 'Near galleries'],
    datePosted: '2024-08-27',
    type: 'studio',
    lookingForRoommate: false
  },
  {
    id: '4',
    title: 'Shared Room in Tech Hub',
    address: '321 Silicon Way, Tech District',
    price: 900,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 400,
    coordinates: {
      latitude: 37.7949,
      longitude: -122.3994
    },
    images: ['https://via.placeholder.com/300x200/FFD93D/FFFFFF?text=Shared+Room'],
    description: 'Looking for a roommate to share this modern apartment near tech companies.',
    amenities: ['WiFi included', 'Shared kitchen', 'Near transit'],
    datePosted: '2024-08-29',
    type: 'shared',
    lookingForRoommate: true
  },
  {
    id: '5',
    title: 'Luxury Penthouse',
    address: '555 Skyline Dr, Uptown',
    price: 3500,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1400,
    coordinates: {
      latitude: 37.7549,
      longitude: -122.4394
    },
    images: ['https://via.placeholder.com/300x200/9B59B6/FFFFFF?text=Penthouse'],
    description: 'Stunning penthouse with city views and luxury amenities.',
    amenities: ['City views', 'Balcony', 'Concierge', 'Gym'],
    datePosted: '2024-08-26',
    type: 'penthouse',
    lookingForRoommate: false
  },
  {
    id: '6',
    title: 'Student Housing Near Campus',
    address: '111 University Ave, Campus Area',
    price: 700,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 500,
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4494
    },
    images: ['https://via.placeholder.com/300x200/3498DB/FFFFFF?text=Student+Housing'],
    description: 'Affordable housing option perfect for students. Walking distance to campus.',
    amenities: ['Study area', 'Bike storage', 'Laundry'],
    datePosted: '2024-08-30',
    type: 'student',
    lookingForRoommate: true
  }
];

export const sortOptions = [
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'date_desc' },
  { label: 'Oldest First', value: 'date_asc' },
  { label: 'Square Footage', value: 'sqft_desc' }
];
