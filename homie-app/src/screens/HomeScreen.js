import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Modal,
  ScrollView 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useApp } from '../utils/AppContext';
import ListingCard from '../components/ListingCard';
import { sortOptions } from '../data/listings';

export default function HomeScreen() {
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
          return new Date(b.datePosted) - new Date(a.datePosted);
        case 'date_asc':
          return new Date(a.datePosted) - new Date(b.datePosted);
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
    const defaultPriceRange = [0, 5000];
    setTempFilters(defaultFilters);
    setTempPriceRange(defaultPriceRange);
    dispatch({ type: 'SET_FILTERS', payload: defaultFilters });
    dispatch({ type: 'SET_PRICE_RANGE', payload: defaultPriceRange });
    setShowFilters(false);
  };

  const renderListing = ({ item }) => (
    <ListingCard 
      listing={item} 
      onPress={() => {
        // TODO: Navigate to listing details
        console.log('Navigate to listing:', item.id);
      }}
    />
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search apartments, locations, amenities..."
          value={state.searchQuery}
          onChangeText={(text) => dispatch({ type: 'SET_SEARCH_QUERY', payload: text })}
        />
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.filterButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Sort and Results Count */}
      <View style={styles.controlsContainer}>
        <Text style={styles.resultsText}>
          {filteredAndSortedListings.length} listings found
        </Text>
        <Picker
          style={styles.sortPicker}
          selectedValue={state.sortBy}
          onValueChange={(value) => dispatch({ type: 'SET_SORT_BY', payload: value })}
          itemStyle={styles.pickerItem}
        >
          {sortOptions.map(option => (
            <Picker.Item 
              key={option.value} 
              label={option.label} 
              value={option.value} 
            />
          ))}
        </Picker>
      </View>

      {/* Active Filters Display */}
      {(state.selectedFilters.bedrooms || 
        state.selectedFilters.type || 
        state.selectedFilters.lookingForRoommate ||
        state.priceRange[0] > 0 || 
        state.priceRange[1] < 5000) && (
        <ScrollView 
          horizontal 
          style={styles.activeFiltersContainer}
          showsHorizontalScrollIndicator={false}
        >
          {state.selectedFilters.bedrooms && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>
                {state.selectedFilters.bedrooms} bed{state.selectedFilters.bedrooms !== '1' ? 's' : ''}
              </Text>
            </View>
          )}
          {state.selectedFilters.type && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>
                {state.selectedFilters.type}
              </Text>
            </View>
          )}
          {state.selectedFilters.lookingForRoommate && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>Looking for roommate</Text>
            </View>
          )}
          {(state.priceRange[0] > 0 || state.priceRange[1] < 5000) && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>
                ${state.priceRange[0]} - ${state.priceRange[1]}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Listings */}
      {filteredAndSortedListings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🏠</Text>
          <Text style={styles.emptyTitle}>No listings found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your search or filters
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedListings}
          renderItem={renderListing}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.closeButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={styles.resetButton}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Price Range</Text>
              <View style={styles.priceRangeContainer}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Min"
                  value={tempPriceRange[0].toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text) || 0;
                    setTempPriceRange([value, tempPriceRange[1]]);
                  }}
                  keyboardType="numeric"
                />
                <Text style={styles.priceSeparator}>to</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Max"
                  value={tempPriceRange[1].toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text) || 5000;
                    setTempPriceRange([tempPriceRange[0], value]);
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Bedrooms */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Bedrooms</Text>
              <View style={styles.buttonGroup}>
                {['1', '2', '3', '4+'].map((bed) => (
                  <TouchableOpacity
                    key={bed}
                    style={[
                      styles.filterOption,
                      tempFilters.bedrooms === bed && styles.filterOptionActive
                    ]}
                    onPress={() => setTempFilters({
                      ...tempFilters,
                      bedrooms: tempFilters.bedrooms === bed ? '' : bed
                    })}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      tempFilters.bedrooms === bed && styles.filterOptionTextActive
                    ]}>
                      {bed}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Property Type */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Property Type</Text>
              <View style={styles.buttonGroup}>
                {['apartment', 'house', 'studio', 'shared'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterOption,
                      tempFilters.type === type && styles.filterOptionActive
                    ]}
                    onPress={() => setTempFilters({
                      ...tempFilters,
                      type: tempFilters.type === type ? '' : type
                    })}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      tempFilters.type === type && styles.filterOptionTextActive
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Looking for Roommate */}
            <View style={styles.filterSection}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setTempFilters({
                  ...tempFilters,
                  lookingForRoommate: !tempFilters.lookingForRoommate
                })}
              >
                <View style={[
                  styles.checkbox,
                  tempFilters.lookingForRoommate && styles.checkboxActive
                ]}>
                  {tempFilters.lookingForRoommate && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Looking for roommate</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
  },
  filterButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: {
    color: 'white',
    fontSize: 16,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sortPicker: {
    width: 150,
    height: 40,
  },
  pickerItem: {
    fontSize: 14,
  },
  activeFiltersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activeFilter: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 16,
    color: '#007AFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    fontSize: 16,
    color: '#FF3B30',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 32,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
  },
  priceSeparator: {
    marginHorizontal: 12,
    fontSize: 16,
    color: '#666',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  filterOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterOptionText: {
    color: '#333',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
