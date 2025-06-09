import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef(); //Permet de naviguer sans utiliser navigation props

export function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}