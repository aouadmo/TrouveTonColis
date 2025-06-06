import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Les Écrans
import HomeScreen from '../screens/HomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignUpProScreen from '../screens/SignUpProScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createNativeStackNavigator();

export default function AuthentNavigator() {
    // Écrans disponibles avant la connexion (publics)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="SignUpProScreen" component={SignUpProScreen} />
      <Stack.Screen name ="SearchScreen" component={SearchScreen}/>
    </Stack.Navigator>
  );
}
