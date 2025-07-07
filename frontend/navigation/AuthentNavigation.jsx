import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Écrans publics avant connexion
import SignUpScreen from '../screens/SignUpScreen';
import SearchScreen from '../screens/SearchScreen';
import DrawerNavigator from './DrawerNavigator';
import RelayInfoScreen from '../screens/RelayInfoScreen';

const Stack = createNativeStackNavigator();

export default function AuthentNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name ="SearchScreen" component={SearchScreen}/>
      <Stack.Screen name="RelayInfoScreen" component={RelayInfoScreen} />
    </Stack.Navigator>
  );
}
