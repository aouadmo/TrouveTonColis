import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import Navigation from './navigation/Navigation';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './navigation/navigationRef';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <NavigationContainer ref={navigationRef}>
          <Navigation />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}


// import 'react-native-gesture-handler';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';

// // Navigation drawer personnalisé
// import DrawerNavigator from './navigation/DrawerNavigator';

// // Écrans principaux
// import SearchScreen from './screens/SearchScreen';
// import SignUpScreen from './screens/SignUpScreen';
// import CameraScreen from './screens/CameraScreen';

// //redux
// import { Provider, useSelector } from 'react-redux';
// import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import user from './reducers/user';
// import { persistStore, persistReducer } from 'redux-persist';
// import { PersistGate } from 'redux-persist/integration/react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import TabNavigationClient from './navigation/TabNavigationClient';
// import TabNavigationPro from './navigation/TabNavigationPro';

// const reducers = combineReducers({ user });
// const persistConfig = { key: 'user', storage: AsyncStorage };

// const store = configureStore({
//   reducer: persistReducer(persistConfig, reducers),
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({ serializableCheck: false }),
// });

// const persistor = persistStore(store);

// // Navigations
// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// function MainNavigation() {
//   const user = useSelector((state) => state.user.value);

//   if (!user.token) {
//     // Si non connecté, on affiche ici les écrans publics
//     return (
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         {/* Le menu que tu veux garder */}
//         <Stack.Screen name="Drawer" component={DrawerNavigator} />

//         {/* Écrans publics NON visibles dans le menu */}
//         <Stack.Screen name="SearchScreen" component={SearchScreen} />
//         <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
//         <Stack.Screen name="CameraScreen" component={CameraScreen} />
//       </Stack.Navigator>
//     );
//   }
//   if (user.role === 'client') {
//     return <TabNavigationClient />;
//   } else if (user.role === 'pro') {
//     return <TabNavigationPro />;
//   } else {
//     return null;
//   }
// }

// // App principale
// export default function App() {
//   return (
//     <Provider store={store}>
//       <PersistGate persistor={persistor}>
//         <NavigationContainer>
//             <MainNavigation />
//         </NavigationContainer>
//       </PersistGate>
//     </Provider>
//   );
// }
