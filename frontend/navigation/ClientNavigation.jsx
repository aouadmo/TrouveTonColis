import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// les screens
import DrawerNavigator from './DrawerNavigator';
import SearchScreen from '../screens/SearchScreen';
import MyParcelsScreen from '../screens/MyParcelsScreen';
import ClientProfileScreen from '../screens/ClientProfileScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = '';
        if (route.name === 'SearchScreen') iconName = 'search';
        else if (route.name === 'MyParcelsScreen') iconName = 'dolly';
        else if (route.name === 'ClientProfileScreen') iconName = 'user';
        return <FontAwesome name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#0F58B8',
      tabBarInactiveTintColor: '#CDF4FF',
      headerShown: false,
    })}
  >
    <Tab.Screen name="SearchScreen" component={SearchScreen} />
    <Tab.Screen name="MyParcelsScreen" component={MyParcelsScreen} />
    <Tab.Screen name="ClientProfileScreen" component={ClientProfileScreen} />
  </Tab.Navigator>
);

export default function ClientNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
    </Stack.Navigator>
  );
}
