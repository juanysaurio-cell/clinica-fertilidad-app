import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { useSavedStore } from '../stores/savedStore';
import { FertilityService } from '../types';

export type HomeStackParamList = {
  HomeScreen: undefined;
  DetailScreen: { item: FertilityService };
};

export type RootTabParamList = {
  HomeTab: undefined;
  SavedTab: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#F8FAFC' }, headerTintColor: '#0284C7' }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Clínica de Fertilidad' }} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} options={{ title: 'Detalle del Tratamiento' }} />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  const savedItems = useSavedStore((state) => state.savedItems);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#0284C7',
        }}
      >
        <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Inicio' }} />
        <Tab.Screen 
          name="SavedTab" 
          component={SavedScreen} 
          options={{ 
            title: 'Guardados',
            tabBarBadge: savedItems.length > 0 ? savedItems.length : undefined,
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}