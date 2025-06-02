import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Les Écrans
import HomeScreen from '../screens/HomeScreen';
import ConnexionScreen from '../screens/ConnexionScreen';
import ConnexionProScreen from '../screens/ConnexionProScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignUpProScreen from '../screens/SignUpProScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    // Écrans disponibles avant la connexion (publics)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ConnexionScreen" component={ConnexionScreen} />
      <Stack.Screen name="ConnexionProScreen" component={ConnexionProScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="SignUpProScreen" component={SignUpProScreen} />
    </Stack.Navigator>
  );
}
