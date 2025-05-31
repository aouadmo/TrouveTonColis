import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// les screens
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import MyParcelsScreen from './screens/MyParcelsScreen';
import ClientProfileScreen from './screens/ClientProfileScreen';
import SignUpScreen from './screens/SignUpScreen';
import ConnexionScreen from './screens/ConnexionScreen';
import RelayInfoScreen from './screens/RelayInfoScreen';
import CameraScreen from './screens/CameraScreen';

//redux
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import user from './reducers/user';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const reducers = combineReducers({ user });
const persistConfig = { key: 'user', storage: AsyncStorage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = '';

        if (route.name === 'Searchscreen') {
          iconName = 'search';
        } else if (route.name === 'MyParcelsScreen') {
          iconName = 'dolly';
        } else if (route.name === 'ClientProfileScreen') {
          iconName = 'user';
        }
        {/*@ts-ignore */ }
        return <FontAwesome name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#0F58B8',
      tabBarInactiveTintColor: '#CDF4FF',
      headerShown: false,
    })}>
      <Tab.Screen name="SearchScreen" component={SearchScreen} />
      <Tab.Screen name="MyParcelsScreen" component={MyParcelsScreen} />
      <Tab.Screen name="ClientProfileScreen" component={ClientProfileScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
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
