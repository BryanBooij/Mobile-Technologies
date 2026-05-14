import React, {useContext} from 'react';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import {BackgroundContext, BackgroundProvider} from "./Context/BackgroundContext";

import Home from './screens/Home';
import Map from './screens/Map';
import Settings from './screens/Settings';
import Details from './screens/ClubDetails';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Club list" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="ClubDetails" component={Details} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

function MainApp() {
    const { isDark } = useContext(BackgroundContext);

    return (
        <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeStack} options={{tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            size={24}
                            color={color}
                        />),}}
                />
                <Tab.Screen name="Map" component={Map} options={{tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'map' : 'map-outline'}
                            size={24}
                            color={color}
                        />),}}
                />
                <Tab.Screen name="Settings" component={Settings} options={{tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'settings' : 'settings-outline'}
                            size={24}
                            color={color}
                        />),}}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <BackgroundProvider>
            <MainApp />
        </BackgroundProvider>
    );
}