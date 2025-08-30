'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Listing } from '../data/listings';
import { useApp } from '../context/AppContext';

interface ListingCardProps {
  listing: Listing;
  onPress?: () => void;
}

export default function ListingCard({ listing, onPress }: ListingCardProps) {
  const { state, dispatch } = useApp();
  const [imageError, setImageError] = useState(false);
  const isSaved = state.savedListings.includes(listing.id);

  const toggleSaved = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_SAVED_LISTING', payload: listing.id });
  };

  return (
    <div 
      className="bg-white rounded-xl mx-4 my-2 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      onClick={onPress}
    >
      <div className="relative">
        {!imageError ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            width={300}
            height={200}
            className="w-full h-48 object-cover rounded-t-xl"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-xl flex items-center justify-center">
            <div className="text-center text-blue-600">
              <div className="text-4xl mb-2">🏠</div>
              <div className="text-sm font-medium">Property Image</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-bold text-gray-900 truncate flex-1">
            {listing.title}
          </h3>
          <button 
            onClick={toggleSaved}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <span className="text-xl">
              {isSaved ? '❤️' : '🤍'}
            </span>
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-2 truncate">{listing.address}</p>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold text-blue-600">
            ${listing.price}/month
          </span>
          <span className="text-xs text-gray-500">
            {listing.bedrooms} bed • {listing.bathrooms} bath • {listing.sqft} sqft
          </span>
        </div>
        
        {listing.lookingForRoommate && (
          <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs inline-block mb-2">
            Looking for roommate
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {listing.amenities.slice(0, 2).map((amenity, index) => (
            <span 
              key={index} 
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
            >
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
