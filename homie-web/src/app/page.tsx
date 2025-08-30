'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ListingCard from '../components/ListingCard';
import { sortOptions } from '../data/listings';

export default function HomePage() {
  const { state, dispatch } = useApp();
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState(state.selectedFilters);
  const [tempPriceRange, setTempPriceRange] = useState(state.priceRange);

  // Filter and sort listings
  const filteredAndSortedListings = useMemo(() => {
    let filtered = state.listings.filter(listing => {
      // Search query filter
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        const matchesSearch = 
          listing.title.toLowerCase().includes(query) ||
          listing.address.toLowerCase().includes(query) ||
          listing.description.toLowerCase().includes(query) ||
          listing.amenities.some(amenity => amenity.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Price range filter
      if (listing.price < state.priceRange[0] || listing.price > state.priceRange[1]) {
        return false;
      }

      // Bedrooms filter
      if (state.selectedFilters.bedrooms && 
          listing.bedrooms.toString() !== state.selectedFilters.bedrooms) {
        return false;
      }

      // Type filter
      if (state.selectedFilters.type && listing.type !== state.selectedFilters.type) {
        return false;
      }

      // Roommate filter
      if (state.selectedFilters.lookingForRoommate && !listing.lookingForRoommate) {
        return false;
      }

      return true;
    });

    // Sort listings
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'date_desc':
          return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
        case 'date_asc':
          return new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime();
        case 'sqft_desc':
          return b.sqft - a.sqft;
        default:
          return 0;
      }
    });

    return filtered;
  }, [state.listings, state.searchQuery, state.sortBy, state.priceRange, state.selectedFilters]);

  const applyFilters = () => {
    dispatch({ type: 'SET_FILTERS', payload: tempFilters });
    dispatch({ type: 'SET_PRICE_RANGE', payload: tempPriceRange });
    setShowFilters(false);
  };

  const resetFilters = () => {
    const defaultFilters = { bedrooms: '', type: '', lookingForRoommate: false };
    const defaultPriceRange: [number, number] = [0, 5000];
    setTempFilters(defaultFilters);
    setTempPriceRange(defaultPriceRange);
    dispatch({ type: 'SET_FILTERS', payload: defaultFilters });
    dispatch({ type: 'SET_PRICE_RANGE', payload: defaultPriceRange });
    setShowFilters(false);
  };

  const hasActiveFilters = state.selectedFilters.bedrooms || 
    state.selectedFilters.type || 
    state.selectedFilters.lookingForRoommate ||
    state.priceRange[0] > 0 || 
    state.priceRange[1] < 5000;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search apartments, locations, amenities..."
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
            className="flex-1 h-10 border border-gray-300 rounded-lg px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            onClick={() => setShowFilters(true)}
            className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            🔍
          </button>
        </div>
      </div>

      {/* Sort and Results Count */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
        <span className="text-base font-semibold text-gray-900">
          {filteredAndSortedListings.length} listings found
        </span>
        <select
          value={state.sortBy}
          onChange={(e) => dispatch({ type: 'SET_SORT_BY', payload: e.target.value })}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex flex-wrap gap-2">
            {state.selectedFilters.bedrooms && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                {state.selectedFilters.bedrooms} bed{state.selectedFilters.bedrooms !== '1' ? 's' : ''}
              </span>
            )}
            {state.selectedFilters.type && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                {state.selectedFilters.type}
              </span>
            )}
            {state.selectedFilters.lookingForRoommate && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                Looking for roommate
              </span>
            )}
            {(state.priceRange[0] > 0 || state.priceRange[1] < 5000) && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                ${state.priceRange[0]} - ${state.priceRange[1]}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Listings */}
      {filteredAndSortedListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold mb-2 text-center">No listings found</h2>
          <p className="text-gray-600 text-center">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-4 md:p-4">
          {filteredAndSortedListings.map((listing) => (
            <ListingCard 
              key={listing.id}
              listing={listing} 
              onPress={() => {
                console.log('Navigate to listing:', listing.id);
              }}
            />
          ))}
        </div>
      )}

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white w-full md:w-96 md:rounded-lg max-h-screen md:max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <button 
                onClick={() => setShowFilters(false)}
                className="text-blue-600 font-medium"
              >
                Cancel
              </button>
              <h2 className="text-lg font-bold">Filters</h2>
              <button 
                onClick={resetFilters}
                className="text-red-600 font-medium"
              >
                Reset
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-8">
              {/* Price Range */}
              <div>
                <h3 className="text-lg font-bold mb-3">Price Range</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={tempPriceRange[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setTempPriceRange([value, tempPriceRange[1]]);
                    }}
                    className="flex-1 h-10 border border-gray-300 rounded-lg px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-600">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={tempPriceRange[1]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 5000;
                      setTempPriceRange([tempPriceRange[0], value]);
                    }}
                    className="flex-1 h-10 border border-gray-300 rounded-lg px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <h3 className="text-lg font-bold mb-3">Bedrooms</h3>
                <div className="flex flex-wrap gap-2">
                  {['1', '2', '3', '4+'].map((bed) => (
                    <button
                      key={bed}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        tempFilters.bedrooms === bed
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setTempFilters({
                        ...tempFilters,
                        bedrooms: tempFilters.bedrooms === bed ? '' : bed
                      })}
                    >
                      {bed}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div>
                <h3 className="text-lg font-bold mb-3">Property Type</h3>
                <div className="flex flex-wrap gap-2">
                  {['apartment', 'house', 'studio', 'shared'].map((type) => (
                    <button
                      key={type}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        tempFilters.type === type
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setTempFilters({
                        ...tempFilters,
                        type: tempFilters.type === type ? '' : type
                      })}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Looking for Roommate */}
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempFilters.lookingForRoommate}
                    onChange={(e) => setTempFilters({
                      ...tempFilters,
                      lookingForRoommate: e.target.checked
                    })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-base font-medium text-gray-700">
                    Looking for roommate
                  </span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200">
              <button 
                onClick={applyFilters}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
