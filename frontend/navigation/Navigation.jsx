import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import ProNavigation from './ProNavigation';
import ClientNavigation from './ClientNavigation';
import AuthentNavigation from './AuthentNavigation';

export default function Navigation() {
  const { token, isPro } = useSelector(state => state.user.value);

  // 🔥 CHANGEMENT ICI : key pour forcer NavigationContainer à se recharger si token change
  const navKey = token ? (isPro ? 'pro' : 'client') : 'auth';

  return (
    <NavigationContainer key={navKey}>
      {!token ? (
        <AuthentNavigation />
      ) : isPro ? (
        <ProNavigation />
      ) : (
        <ClientNavigation />
      )}
    </NavigationContainer>
  );
}
