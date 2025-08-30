import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useApp } from '../utils/AppContext';

export default function MapScreen() {
  const { state, dispatch } = useApp();
  const [selectedListing, setSelectedListing] = useState(null);

  const toggleSaved = (listingId) => {
    dispatch({ type: 'TOGGLE_SAVED_LISTING', payload: listingId });
  };

  const MarkerCallout = ({ listing }) => (
    <Callout 
      style={styles.callout}
      onPress={() => setSelectedListing(listing)}
    >
      <View style={styles.calloutContent}>
        <Text style={styles.calloutTitle} numberOfLines={1}>{listing.title}</Text>
        <Text style={styles.calloutPrice}>${listing.price}/month</Text>
        <Text style={styles.calloutSpecs}>
          {listing.bedrooms} bed • {listing.bathrooms} bath
        </Text>
        <Text style={styles.calloutTap}>Tap for details</Text>
      </View>
    </Callout>
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {state.listings.map(listing => (
          <Marker
            key={listing.id}
            coordinate={listing.coordinates}
            title={listing.title}
          >
            <View style={styles.markerContainer}>
              <Text style={styles.markerText}>${listing.price}</Text>
            </View>
            <MarkerCallout listing={listing} />
          </Marker>
        ))}
      </MapView>

      {/* Listing Detail Modal */}
      <Modal
        visible={!!selectedListing}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedListing && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedListing(null)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Listing Details</Text>
              <TouchableOpacity onPress={() => toggleSaved(selectedListing.id)}>
                <Text style={styles.saveButton}>
                  {state.savedListings.includes(selectedListing.id) ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Image source={{ uri: selectedListing.images[0] }} style={styles.modalImage} />
              
              <View style={styles.modalDetails}>
                <Text style={styles.modalListingTitle}>{selectedListing.title}</Text>
                <Text style={styles.modalAddress}>{selectedListing.address}</Text>
                
                <View style={styles.priceSection}>
                  <Text style={styles.modalPrice}>${selectedListing.price}/month</Text>
                  {selectedListing.lookingForRoommate && (
                    <Text style={styles.roommateTag}>Looking for roommate</Text>
                  )}
                </View>
                
                <View style={styles.specsSection}>
                  <Text style={styles.spec}>{selectedListing.bedrooms} Bedrooms</Text>
                  <Text style={styles.spec}>{selectedListing.bathrooms} Bathrooms</Text>
                  <Text style={styles.spec}>{selectedListing.sqft} sqft</Text>
                </View>
                
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.description}>{selectedListing.description}</Text>
                
                <Text style={styles.amenitiesTitle}>Amenities</Text>
                <View style={styles.amenitiesList}>
                  {selectedListing.amenities.map((amenity, index) => (
                    <Text key={index} style={styles.amenity}>• {amenity}</Text>
                  ))}
                </View>
                
                <Text style={styles.datePosted}>
                  Posted on {new Date(selectedListing.datePosted).toLocaleDateString()}
                </Text>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  markerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  callout: {
    width: 200,
  },
  calloutContent: {
    padding: 8,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutPrice: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  calloutSpecs: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  calloutTap: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 50,
  },
  closeButton: {
    fontSize: 20,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    fontSize: 24,
  },
  modalContent: {
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: 250,
  },
  modalDetails: {
    padding: 16,
  },
  modalListingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalAddress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 12,
  },
  roommateTag: {
    backgroundColor: '#FF9500',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
  },
  specsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  spec: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  amenitiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  amenitiesList: {
    marginBottom: 16,
  },
  amenity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  datePosted: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
});
