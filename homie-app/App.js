import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import context
import { AppProvider } from './src/utils/AppContext';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import SavedScreen from './src/screens/SavedScreen';
import PostListingScreen from './src/screens/PostListingScreen';

const Tab = createBottomTabNavigator();

function AppContent() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tab.Screen 
          name="Search" 
          component={HomeScreen}
          options={{
            tabBarLabel: 'Search',
            title: 'Find Your Home'
          }}
        />
        <Tab.Screen 
          name="Map" 
          component={MapScreen}
          options={{
            tabBarLabel: 'Map',
            title: 'Map View'
          }}
        />
        <Tab.Screen 
          name="Saved" 
          component={SavedScreen}
          options={{
            tabBarLabel: 'Saved',
            title: 'Saved Listings'
          }}
        />
        <Tab.Screen 
          name="Post" 
          component={PostListingScreen}
          options={{
            tabBarLabel: 'Post',
            title: 'Post Listing'
          }}
        />
      </Tab.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}
