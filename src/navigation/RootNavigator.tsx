import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootTabParamList, HomeStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#F8FAFC' }, headerShadowVisible: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Explorar' }} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} options={{ title: 'Detalle del Tratamiento' }} />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#0284C7' }}>
        <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: 'Inicio' }} />
        <Tab.Screen name="FavoritesScreen" component={FavoritesScreen} options={{ title: 'Guardados' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}