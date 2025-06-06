import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Écrans publics avant connexion
import HomeScreen from '../screens/HomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SearchScreen from '../screens/SearchScreen';
import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();

export default function AuthentNavigator() {
    // Écrans disponibles avant la connexion (publics)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name ="SearchScreen" component={SearchScreen}/>
    </Stack.Navigator>
  );
}
