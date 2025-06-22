import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

// Les écrans
import DrawerNavigator from './DrawerNavigator';
import SearchScreen from '../screens/SearchScreen';
import MyParcelsScreen from '../screens/MyParcelsScreen';
import ClientProfileScreen from '../screens/ClientProfileScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MapScreen from '../screens/MapScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigatorClient = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
        
          if (route.name === 'MyParcelsScreen') {
            iconName = 'archive';
          } else if (route.name === 'SearchScreen') {
            iconName = 'search';
          } else if (route.name === 'ProfilClient') {
            return (
              <FontAwesome name="user" size={size} color={color} />
            );
          }
          
          // AJOUT MANQUANT : Return pour FontAwesome
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0F58B8',
        tabBarInactiveTintColor: '#79B4C4',
        headerShown: false,
      })}
    >
      <Tab.Screen name="ProfilClient" component={ClientProfileScreen} options={{ title: 'Profil' }} />
      <Tab.Screen name="SearchScreen" component={SearchScreen} options={{ title: 'Rechercher' }} />
      <Tab.Screen name="MyParcelsScreen" component={MyParcelsScreen} options={{ title: 'Mes colis' }} />
    </Tab.Navigator>
  );
};

export default function ClientNavigation() {
  const { token } = useSelector((state) => state.user.value);
  const navigation = useNavigation();

  useEffect(() => {
    if (token) {
      navigation.navigate('TabNavigatorClient', {
        screen: 'MyParcelsScreen',
      });
    }
  }, [token]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      <Stack.Screen name="TabNavigatorClient" component={TabNavigatorClient} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
