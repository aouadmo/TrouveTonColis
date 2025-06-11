import React from 'react';
import { useSelector } from 'react-redux';

import AuthentNavigation from './AuthentNavigation';
import ClientNavigation from './ClientNavigation';
import ProNavigation from './ProNavigation';

export default function Navigation() {
const { token, isPro } = useSelector(state => state.user.value);


  if (!token) {
    return <AuthentNavigation />;
  } else if (isPro) {
    return <ProNavigation />;
  } else {
    return <ClientNavigation />
  }
}
