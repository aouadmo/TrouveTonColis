import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Navigation drawer personnalisé
import DrawerNavigator from './navigation/DrawerNavigator';

// Écrans principaux
import SearchScreen from './screens/SearchScreen';
import MyParcelsScreen from './screens/MyParcelsScreen';
import ClientProfileScreen from './screens/ClientProfileScreen';
import SignUpScreen from './screens/SignUpScreen';
import ConnexionScreen from './screens/ConnexionScreen';
import RelayInfoScreen from './screens/RelayInfoScreen';
import CameraScreen from './screens/CameraScreen';

// Redux + persistance
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import user from './reducers/user';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration Redux persist
const reducers = combineReducers({ user });
const persistConfig = { key: 'user', storage: AsyncStorage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

// Navigations
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Barre de navigation en bas (client)
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'SearchScreen') {
            iconName = 'search';
          } else if (route.name === 'MyParcelsScreen') {
            iconName = 'dolly';
          } else if (route.name === 'ClientProfileScreen') {
            iconName = 'user';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0F58B8',
        tabBarInactiveTintColor: '#CDF4FF',
        headerShown: false,
      })}
    >
      <Tab.Screen name="SearchScreen" component={SearchScreen} />
      <Tab.Screen name="MyParcelsScreen" component={MyParcelsScreen} />
      <Tab.Screen name="ClientProfileScreen" component={ClientProfileScreen} />
    </Tab.Navigator>
  );
};

// App principale
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Page d’accueil avec menu drawer intégré */}
            <Stack.Screen name="MainDrawer" component={DrawerNavigator} />

            {/* Autres écrans accessibles via navigation */}
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
            <Stack.Screen name="ConnexionScreen" component={ConnexionScreen} />
            <Stack.Screen name="CameraScreen" component={CameraScreen} />
            <Stack.Screen name="RelayInfoScreen" component={RelayInfoScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
