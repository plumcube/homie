import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listings as initialListings } from '../data/listings';

const AppContext = createContext();

const initialState = {
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

function appReducer(state, action) {
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
      const newListing = {
        ...action.payload,
        id: Date.now().toString(),
        datePosted: new Date().toISOString().split('T')[0]
      };
      return { ...state, listings: [...state.listings, newListing] };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved listings from storage
  useEffect(() => {
    const loadSavedListings = async () => {
      try {
        const saved = await AsyncStorage.getItem('savedListings');
        if (saved) {
          dispatch({ type: 'SET_SAVED_LISTINGS', payload: JSON.parse(saved) });
        }
      } catch (error) {
        console.error('Error loading saved listings:', error);
      }
    };
    loadSavedListings();
  }, []);

  // Save listings to storage whenever they change
  useEffect(() => {
    const saveSavedListings = async () => {
      try {
        await AsyncStorage.setItem('savedListings', JSON.stringify(state.savedListings));
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
