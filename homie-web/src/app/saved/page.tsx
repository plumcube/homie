'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import ListingCard from '../../components/ListingCard';

export default function SavedPage() {
  const { state } = useApp();
  
  const savedListings = state.listings.filter(listing => 
    state.savedListings.includes(listing.id)
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Saved Listings</h1>
        
        {savedListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-2xl font-bold mb-2 text-center">No saved listings</h2>
            <p className="text-gray-600 text-center">
              Start browsing and save your favorite listings to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-4">
            {savedListings.map((listing) => (
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
      </div>
    </div>
  );
}
