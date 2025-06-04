import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import ProNavigation from './ProNavigation';
import ClientNavigation from './ClientNavigation';
import AuthentNavigation from './AuthentNavigation';

export default function Navigation() {
  const { token, isPro } = useSelector(state => state.user.value);
  return (
    <NavigationContainer> {!token ? (<AuthentNavigation />) : isPro ? (<ProNavigation />) : (<ClientNavigation />)}</NavigationContainer>
  );
}


