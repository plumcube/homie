'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Listing } from '../../data/listings';
import Image from 'next/image';

export default function MapPage() {
  const { state, dispatch } = useApp();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const toggleSaved = (listingId: string) => {
    dispatch({ type: 'TOGGLE_SAVED_LISTING', payload: listingId });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Map placeholder - in a real app you'd use Google Maps or Mapbox */}
      <div className="relative bg-green-100 h-96 md:h-[500px] m-4 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-200 to-blue-200">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Interactive Map View</h2>
            <p className="text-gray-600">Map integration would go here</p>
          </div>
        </div>
        
        {/* Simulated map markers */}
        <div className="absolute inset-0">
          {state.listings.map((listing, index) => (
            <button
              key={listing.id}
              onClick={() => setSelectedListing(listing)}
              className="absolute bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg hover:bg-blue-700 transition-colors"
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + (index % 3) * 20}%`,
              }}
            >
              ${listing.price}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">All Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.listings.map((listing) => (
            <div 
              key={listing.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              onClick={() => setSelectedListing(listing)}
            >
              <Image
                src={listing.images[0]}
                alt={listing.title}
                width={300}
                height={200}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm truncate flex-1">{listing.title}</h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaved(listing.id);
                    }}
                    className="ml-2"
                  >
                    <span className="text-lg">
                      {state.savedListings.includes(listing.id) ? '❤️' : '🤍'}
                    </span>
                  </button>
                </div>
                <p className="text-xs text-gray-600 mb-2">{listing.address}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-600">${listing.price}</span>
                  <span className="text-xs text-gray-500">
                    {listing.bedrooms}bd • {listing.bathrooms}ba
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <Image
                src={selectedListing.images[0]}
                alt={selectedListing.title}
                width={600}
                height={300}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <button
                onClick={() => setSelectedListing(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedListing.title}</h2>
                  <p className="text-gray-600">{selectedListing.address}</p>
                </div>
                <button 
                  onClick={() => toggleSaved(selectedListing.id)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <span className="text-2xl">
                    {state.savedListings.includes(selectedListing.id) ? '❤️' : '🤍'}
                  </span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-2xl font-bold text-blue-600">
                    ${selectedListing.price}/month
                  </span>
                </div>
                <div className="text-right text-gray-600">
                  {selectedListing.bedrooms} bed • {selectedListing.bathrooms} bath • {selectedListing.sqft} sqft
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{selectedListing.description}</p>
              
              {selectedListing.lookingForRoommate && (
                <div className="bg-orange-500 text-white px-3 py-2 rounded-lg inline-block mb-4">
                  Looking for roommate
                </div>
              )}
              
              <div>
                <h3 className="font-bold mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedListing.amenities.map((amenity, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
