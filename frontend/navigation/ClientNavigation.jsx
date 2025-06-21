import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

// Import des écrans
import DrawerNavigator from './DrawerNavigator';
import SearchScreen from '../screens/SearchScreen';
import MyParcelsScreen from '../screens/MyParcelsScreen';
import ClientProfileScreen from '../screens/ClientProfileScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MapScreen from '../screens/MapScreen';

// Création des navigateurs
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navigateur à onglets pour les clients connectés
const TabNavigatorClient = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Configuration des icônes pour chaque onglet
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          // Attribution des icônes selon l'écran
          if (route.name === 'MyParcelsScreen') {
            iconName = 'archive';
          } else if (route.name === 'SearchScreen') {
            iconName = 'search';
          } else if (route.name === 'ProfilClient') {
            iconName = 'user';
          }

          // Retour de l'icône avec les bonnes propriétés
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        // Couleurs des onglets
        tabBarActiveTintColor: '#0F58B8',   // Couleur active (bleu)
        tabBarInactiveTintColor: '#79B4C4', // Couleur inactive (gris-bleu)
        headerShown: false, // Masquer le header par défaut
      })}
    >
      {/* Définition des onglets - ordre d'affichage */}
      <Tab.Screen 
        name="ProfilClient" 
        component={ClientProfileScreen} 
        options={{ title: 'Mon Profil' }} 
      />
      <Tab.Screen 
        name="SearchScreen" 
        component={SearchScreen} 
        options={{ title: 'Rechercher' }} 
      />
      <Tab.Screen 
        name="MyParcelsScreen" 
        component={MyParcelsScreen} 
        options={{ title: 'Mes colis' }} 
      />
    </Tab.Navigator>
  );
};

// Navigateur principal pour la section client
export default function ClientNavigation() {
  // Récupération du token depuis Redux
  const { token } = useSelector((state) => state.user.value);
  const navigation = useNavigation();

  // Redirection automatique après connexion
  useEffect(() => {
    if (token) {
      // Si l'utilisateur est connecté, on le redirige vers les onglets
      navigation.navigate('TabNavigatorClient', {
        screen: 'ProfilClient', // Onglet d'arrivée après connexion
      });
    }
  }, [token]); // Se déclenche quand le token change

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Écran du menu burger (page d'accueil) */}
      <Stack.Screen 
        name="DrawerNavigator" 
        component={DrawerNavigator} 
      />
      
      {/* Écrans à onglets pour clients connectés */}
      <Stack.Screen 
        name="TabNavigatorClient" 
        component={TabNavigatorClient} 
      />
      
      {/* Écran d'inscription (accessible depuis le drawer) */}
      <Stack.Screen 
        name="SignUpScreen" 
        component={SignUpScreen} 
      />
    </Stack.Navigator>
  );
}