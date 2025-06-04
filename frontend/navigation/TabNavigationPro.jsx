import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import TableauBordScreen from '../screens/TableauBordScreen';
import MonStockScreen from '../screens/MonStockScreen';
import ProfilProScreen from '../screens/ProfilProScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigationClient() {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
                let iconName = '';

                if (route.name === 'TableauBordScreen') {
                    iconName = 'search';
                } else if (route.name === 'MonStockScreen') {
                    iconName = 'dolly';
                } else if (route.name === 'ProfilProScreen') {
                    iconName = 'user';
                }

                return <FontAwesome name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#4F378A',
            tabBarInactiveTintColor: '#D0BCFF',
            headerShown: false,
        })}>
            <Tab.Screen name="TableauBordScreen" component={TableauBordScreen} />
            <Tab.Screen name="MonStockScreen" component={MonStockScreen} />
            <Tab.Screen name="ProfilProScreen" component={ProfilProScreen} />
        </Tab.Navigator>
    );
}