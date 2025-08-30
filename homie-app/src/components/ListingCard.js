import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useApp } from '../utils/AppContext';

export default function ListingCard({ listing, onPress }) {
  const { state, dispatch } = useApp();
  const isSaved = state.savedListings.includes(listing.id);

  const toggleSaved = () => {
    dispatch({ type: 'TOGGLE_SAVED_LISTING', payload: listing.id });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: listing.images[0] }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>
          <TouchableOpacity onPress={toggleSaved} style={styles.saveButton}>
            <Text style={[styles.saveIcon, isSaved && styles.savedIcon]}>
              {isSaved ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.address} numberOfLines={1}>{listing.address}</Text>
        
        <View style={styles.details}>
          <Text style={styles.price}>${listing.price}/month</Text>
          <Text style={styles.specs}>
            {listing.bedrooms} bed • {listing.bathrooms} bath • {listing.sqft} sqft
          </Text>
        </View>
        
        {listing.lookingForRoommate && (
          <Text style={styles.roommateTag}>Looking for roommate</Text>
        )}
        
        <View style={styles.amenities}>
          {listing.amenities.slice(0, 2).map((amenity, index) => (
            <Text key={index} style={styles.amenity}>{amenity}</Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  saveButton: {
    padding: 4,
  },
  saveIcon: {
    fontSize: 20,
  },
  savedIcon: {
    color: '#FF3B30',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  specs: {
    fontSize: 12,
    color: '#999',
  },
  roommateTag: {
    backgroundColor: '#FF9500',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenity: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: '#666',
    marginRight: 8,
    marginBottom: 4,
  },
});
