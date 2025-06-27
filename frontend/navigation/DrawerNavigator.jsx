import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Écrans visibles dans le menu
import HomeScreen from '../screens/HomeScreen';
import HistoireRelais from '../screens/HistoireRelais';
import FAQScreen from '../screens/FAQScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SearchScreen from '../screens/SearchScreen';
import CameraScreen from '../screens/CameraScreen';
import MapScreen from '../screens/MapScreen';
import SmsReplyScreen from '../screens/SmsReplyScreen';

// Écrans supplémentaires
import TableauBordScreen from '../screens/TableauBordScreen';
import ClientProfileScreen from '../screens/ClientProfileScreen';
import RelayInfoScreen from '../screens/RelayInfoScreen';

// Menu customisé
import CustomDrawer from '../components/DrawerMenu';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false, // on cache l'en-tête React Navigation
      }}
    >
      {/* Écrans principaux du menu */}
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: 'Accueil' }}
      />
      
      <Drawer.Screen
        name="HistoireRelais"
        component={HistoireRelais}
        options={{ title: 'C\'est quoi un point relais ?' }}
      />
      
      <Drawer.Screen
        name="FAQ"
        component={FAQScreen}
        options={{ title: 'FAQ' }}
      />

      <Drawer.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{ title: 'Inscription' }}
      />

      {/* Écrans utilitaires */}
      <Drawer.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ title: 'Cherchez votre colis !' }}
      />

      <Drawer.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{ title: 'Appareil photo' }}
      />

      <Drawer.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ title: 'Carte des points relais' }}
      />
      
      <Drawer.Screen
        name="SmsReplyScreen"
        component={SmsReplyScreen}
        options={{ title: 'Réponse SMS' }}
      />

      <Drawer.Screen
        name="RelayInfoScreen"
        component={RelayInfoScreen}
        options={{ title: 'Informations point relais' }}
      />

      {/* Écrans utilisateur */}
      <Drawer.Screen
        name="TableauBordScreen"
        component={TableauBordScreen}
        options={{ title: 'Tableau de bord pros' }}
      />
      
      <Drawer.Screen
        name="ClientProfileScreen"
        component={ClientProfileScreen}
        options={{ title: 'Profil client' }}
      />
    </Drawer.Navigator>
  );
}