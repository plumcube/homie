import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useApp } from '../utils/AppContext';
import ListingCard from '../components/ListingCard';

export default function SavedScreen() {
  const { state } = useApp();
  
  const savedListings = state.listings.filter(listing => 
    state.savedListings.includes(listing.id)
  );

  const renderListing = ({ item }) => (
    <ListingCard 
      listing={item} 
      onPress={() => {
        // TODO: Navigate to listing details
        console.log('Navigate to saved listing:', item.id);
      }}
    />
  );

  if (savedListings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🏠</Text>
        <Text style={styles.emptyTitle}>No Saved Listings</Text>
        <Text style={styles.emptySubtitle}>
          Start exploring and save listings you're interested in!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {savedListings.length} Saved Listing{savedListings.length !== 1 ? 's' : ''}
      </Text>
      
      <FlatList
        data={savedListings}
        renderItem={renderListing}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
