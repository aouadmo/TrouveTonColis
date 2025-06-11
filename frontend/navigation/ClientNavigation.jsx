import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Les écrans
import DrawerNavigator from './DrawerNavigator';
import SearchScreen from '../screens/SearchScreen';
import MyParcelsScreen from '../screens/MyParcelsScreen';
import ClientProfileScreen from '../screens/ClientProfileScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigatorClient = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'MesColis') {
            return (
              <MaterialCommunityIcons name="package" size={size} color={color} />
            );
          } else if (route.name === 'Search') {
            return (
              <FontAwesome name="search" size={size} color={color} />
            );
          } else if (route.name === 'ProfilClient') {
            return (
              <FontAwesome name="user" size={size} color={color} />
            );
          }
        },
        tabBarActiveTintColor: '#0F58B8',
        tabBarInactiveTintColor: '#79B4C4',
        headerShown: false,
      })}
    >
      <Tab.Screen name="ProfilClient" component={ClientProfileScreen} options={{ title: 'Profil' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Rechercher' }} />
      <Tab.Screen name="MesColis" component={MyParcelsScreen} options={{ title: 'Mes colis' }} />
    </Tab.Navigator>
  );
};

export default function ClientNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen name="TabClient" component={TabNavigatorClient} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
