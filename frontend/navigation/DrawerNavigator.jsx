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
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: 'Accueil' }}
      />
      <Drawer.Screen
        name="HistoireRelais"
        component={HistoireRelais}
        options={{ title: 'C’est quoi un point relais ?' }}
      />
      <Drawer.Screen
        name="FAQ"
        component={FAQScreen}
        options={{ title: 'FAQScreen' }}
      />

      <Drawer.Screen
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
      />

      <Drawer.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ title: 'Trouvez votre point relais sur la carte' }}
      />
      <Drawer.Screen
        name="SmsReplyScreen"
        component={SmsReplyScreen}
        options={{ title: 'Prenez vos plus belles photos !' }}
      />
    </Drawer.Navigator>

  );
}
