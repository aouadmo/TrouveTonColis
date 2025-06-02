import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import ProNavigation from './ProNavigation';
import ClientNavigation from './ClientNavigation';
import AuthentNavigation from './AuthentNavigation'; // Écrans avant connexion

export default function Navigation() {
    // Récupération du token et du rôle pro ou client depuis Redux
  const { token, isPro } = useSelector(state => state.user);

  return (
    <NavigationContainer>
      {!token ? ( <AuthentNavigation />) : isPro ? (<ProNavigation />) : (<ClientNavigation />)}
    </NavigationContainer>
  );
};

