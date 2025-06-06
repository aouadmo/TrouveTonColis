import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Screens visibles dans le menu
import HomeScreen from '../screens/HomeScreen';
import HistoireRelais from '../screens/HistoireRelais';
import FAQScreen from '../screens/FAQScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SearchScreen from '../screens/SearchScreen';
import CameraScreen from '../screens/CameraScreen';

// Menu customisé
import CustomDrawer from '../components/DrawerMenu';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false, // On masque l'en-tête de React Navigation (on utilise notre Header perso)
      }}
    >
      {/* Accueil (page principale) */}
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: 'Accueil' }}
      />

      {/* Lien vers la page explicative */}
      <Drawer.Screen
        name="HistoireRelais"
        component={HistoireRelais}
        options={{ title: 'C’est quoi un point relais ?' }}
      />

      {/* Lien vers la page FAQ */}
      <Drawer.Screen
        name="FAQ"
        component={FAQScreen}
        options={{ title: 'FAQ' }}
      />

      {/* <Drawer.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{ title: 'Inscription' }}
      />

      <Drawer.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ title: 'Cherchez votre colis !' }}
      />

      <Drawer.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{ title: 'Prenez vos plus belles photos !' }}
      /> */}
    </Drawer.Navigator>
  );
}
