import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

//Les Écrans
import DrawerNavigator from './DrawerNavigator';
import SingUpProScreen from '../screens/SignUpProScreen';
import MonStockScreen from '../screens/MonStockScreen';
import TableauBordScreen from '../screens/TableauBordScreen';
import ProfilProScreen from '../screens/ProfilProScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigatorPro = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = '';
        if (route.name === 'TableauBord') {
          iconName = 'chart-line';
        } else if (route.name === 'MonStock') {
          iconName = 'boxes';
        } else if (route.name === 'ProfilPro') {
          iconName = 'user-tie';
        }
        return <FontAwesome5 name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4F378A',
      tabBarInactiveTintColor: '#CDF4FF',
      headerShown: false,
    })}
  >
    <Tab.Screen name="TableauBord" component={TableauBordScreen} />
    <Tab.Screen name="MonStock" component={MonStockScreen} />
    <Tab.Screen name="ProfilPro" component={ProfilProScreen} />
  </Tab.Navigator>
);

export default function ProNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      <Stack.Screen name="TabNavigatorPro" component={TabNavigatorPro} />
      <Stack.Screen name="SignUpProScreen" component={SingUpProScreen} />
    </Stack.Navigator>
  );
}