import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SearchScreen from '../screens/SearchScreen';
import MyParcelsScreen from '../screens/MyParcelsScreen';
import ClientProfileScreen from '../screens/ClientProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigationClient() {
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
}