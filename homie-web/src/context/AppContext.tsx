'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Listing, listings as initialListings } from '../data/listings';

interface AppState {
  listings: Listing[];
  savedListings: string[];
  searchQuery: string;
  sortBy: string;
  priceRange: [number, number];
  selectedFilters: {
    bedrooms: string;
    type: string;
    lookingForRoommate: boolean;
  };
}

type AppAction =
  | { type: 'SET_SAVED_LISTINGS'; payload: string[] }
  | { type: 'TOGGLE_SAVED_LISTING'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SORT_BY'; payload: string }
  | { type: 'SET_PRICE_RANGE'; payload: [number, number] }
  | { type: 'SET_FILTERS'; payload: Partial<AppState['selectedFilters']> }
  | { type: 'ADD_LISTING'; payload: Omit<Listing, 'id' | 'datePosted'> };

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

const initialState: AppState = {
  listings: initialListings,
  savedListings: [],
  searchQuery: '',
  sortBy: 'date_desc',
  priceRange: [0, 5000],
  selectedFilters: {
    bedrooms: '',
    type: '',
    lookingForRoommate: false
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SAVED_LISTINGS':
      return { ...state, savedListings: action.payload };
    case 'TOGGLE_SAVED_LISTING':
      const isCurrentlySaved = state.savedListings.includes(action.payload);
      const newSavedListings = isCurrentlySaved
        ? state.savedListings.filter(id => id !== action.payload)
        : [...state.savedListings, action.payload];
      return { ...state, savedListings: newSavedListings };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'SET_PRICE_RANGE':
      return { ...state, priceRange: action.payload };
    case 'SET_FILTERS':
      return { ...state, selectedFilters: { ...state.selectedFilters, ...action.payload } };
    case 'ADD_LISTING':
      const newListing: Listing = {
        ...action.payload,
        id: Date.now().toString(),
        datePosted: new Date().toISOString().split('T')[0]
      };
      return { ...state, listings: [...state.listings, newListing] };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved listings from localStorage
  useEffect(() => {
    const loadSavedListings = () => {
      try {
        const saved = localStorage.getItem('savedListings');
        if (saved) {
          dispatch({ type: 'SET_SAVED_LISTINGS', payload: JSON.parse(saved) });
        }
      } catch (error) {
        console.error('Error loading saved listings:', error);
      }
    };
    loadSavedListings();
  }, []);

  // Save listings to localStorage whenever they change
  useEffect(() => {
    const saveSavedListings = () => {
      try {
        localStorage.setItem('savedListings', JSON.stringify(state.savedListings));
      } catch (error) {
        console.error('Error saving listings:', error);
      }
    };
    saveSavedListings();
  }, [state.savedListings]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
