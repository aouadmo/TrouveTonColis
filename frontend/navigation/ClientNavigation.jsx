import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
          let iconName = '';

          if (route.name === 'MesColis') {
            iconName = 'dolly';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'ProfilClient') {
            iconName = 'user';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0F58B8',
        tabBarInactiveTintColor: '#CDF4FF',
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
