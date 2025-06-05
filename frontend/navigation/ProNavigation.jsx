import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//Les Écrans
import DrawerNavigator from './DrawerNavigator';
import SingUpProScreen from '../screens/SignUpProScreen';
import MonStockScreen from '../screens/MonStockScreen';
import TableauBordScreen from '../screens/TableauBordScreen';
import ProfilProScreen from '../screens/ProfilProScreen';

//Redux
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import user from '../reducers/user';
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
        if (route.name === 'TableauBord') {
          iconName = 'dashboard';
        } else if (route.name === 'MonStock') {
          iconName = 'box-check';
        } else if (route.name === 'ProfilPro') {
          iconName = 'user';
        }
        {/*@ts-ignore */ }
        return <FontAwesome name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4F378A',
      tabBarInactiveTintColor: '#CDF4FF',
      headerShown: false,
    })}>
      <Tab.Screen name="TableauBord" component={TableauBordScreen} />
      <Tab.Screen name="MonStockScreen" component={MonStockScreen} />
      <Tab.Screen name="ProfilProScreen" component={ProfilProScreen} />
    </Tab.Navigator>
  );
};
export default function App() {
return (

<Provider store={store}>
  <PersistGate persistor={persistor}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name = "SignUpProScreen" component={SingUpProScreen}/>
      </Stack.Navigator>
  </PersistGate>
</Provider>
);
}