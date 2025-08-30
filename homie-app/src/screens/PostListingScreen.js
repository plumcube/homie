import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useApp } from '../utils/AppContext';

export default function PostListingScreen() {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    price: '',
    bedrooms: '1',
    bathrooms: '1',
    sqft: '',
    description: '',
    type: 'apartment',
    lookingForRoommate: false,
    amenities: ''
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Error', 'Please enter an address');
      return false;
    }
    if (!formData.price || isNaN(formData.price)) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }
    if (!formData.sqft || isNaN(formData.sqft)) {
      Alert.alert('Error', 'Please enter valid square footage');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return false;
    }
    return true;
  };

  const submitListing = () => {
    if (!validateForm()) return;

    // Generate random coordinates near San Francisco for demo
    const baseLatitude = 37.7749;
    const baseLongitude = -122.4194;
    const randomLat = baseLatitude + (Math.random() - 0.5) * 0.05;
    const randomLng = baseLongitude + (Math.random() - 0.5) * 0.05;

    const newListing = {
      ...formData,
      price: parseInt(formData.price),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      sqft: parseInt(formData.sqft),
      coordinates: {
        latitude: randomLat,
        longitude: randomLng
      },
      images: ['https://via.placeholder.com/300x200/34495E/FFFFFF?text=New+Listing'],
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a)
    };

    dispatch({ type: 'ADD_LISTING', payload: newListing });

    Alert.alert(
      'Success!', 
      'Your listing has been posted successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setFormData({
              title: '',
              address: '',
              price: '',
              bedrooms: '1',
              bathrooms: '1',
              sqft: '',
              description: '',
              type: 'apartment',
              lookingForRoommate: false,
              amenities: ''
            });
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Post a New Listing</Text>
      
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => updateField('title', text)}
            placeholder="e.g., Cozy 2BR Apartment Downtown"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address *</Text>
          <TextInput
            style={styles.input}
            value={formData.address}
            onChangeText={(text) => updateField('address', text)}
            placeholder="e.g., 123 Main St, City, State"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Monthly Rent *</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(text) => updateField('price', text)}
              placeholder="1500"
              keyboardType="numeric"
            />
          </View>
          
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Square Feet *</Text>
            <TextInput
              style={styles.input}
              value={formData.sqft}
              onChangeText={(text) => updateField('sqft', text)}
              placeholder="800"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Bedrooms</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.bedrooms}
                onValueChange={(value) => updateField('bedrooms', value)}
                style={styles.picker}
              >
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="3" value="3" />
                <Picker.Item label="4" value="4" />
                <Picker.Item label="5+" value="5" />
              </Picker>
            </View>
          </View>
          
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Bathrooms</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.bathrooms}
                onValueChange={(value) => updateField('bathrooms', value)}
                style={styles.picker}
              >
                <Picker.Item label="1" value="1" />
                <Picker.Item label="1.5" value="1.5" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="2.5" value="2.5" />
                <Picker.Item label="3+" value="3" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.type}
              onValueChange={(value) => updateField('type', value)}
              style={styles.picker}
            >
              <Picker.Item label="Apartment" value="apartment" />
              <Picker.Item label="House" value="house" />
              <Picker.Item label="Studio" value="studio" />
              <Picker.Item label="Shared Room" value="shared" />
              <Picker.Item label="Penthouse" value="penthouse" />
            </Picker>
          </View>
        </View>

        <View style={styles.switchGroup}>
          <Text style={styles.label}>Looking for Roommate</Text>
          <Switch
            value={formData.lookingForRoommate}
            onValueChange={(value) => updateField('lookingForRoommate', value)}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={formData.lookingForRoommate ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => updateField('description', text)}
            placeholder="Describe your property, neighborhood, and what makes it special..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amenities</Text>
          <TextInput
            style={styles.input}
            value={formData.amenities}
            onChangeText={(text) => updateField('amenities', text)}
            placeholder="Parking, Laundry, Pet friendly (separate with commas)"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={submitListing}>
          <Text style={styles.submitButtonText}>Post Listing</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    flex: 0.48,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
