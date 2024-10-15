// File: App.js
// Path: /FITDJ/App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutSessionScreen } from './screens/WorkoutSessionScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { WorkoutProvider } from './contexts/WorkoutContext';
import { SettingsProvider } from './contexts/SettingsContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <SettingsProvider>
        <WorkoutProvider>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Workout') {
                  iconName = focused ? 'fitness' : 'fitness-outline';
                } else if (route.name === 'History') {
                  iconName = focused ? 'time' : 'time-outline';
                } else if (route.name === 'Settings') {
                  iconName = focused ? 'settings' : 'settings-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: 'purple',
              inactiveTintColor: 'gray',
            }}
          >
            <Tab.Screen name="Workout" component={WorkoutSessionScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </WorkoutProvider>
      </SettingsProvider>
    </NavigationContainer>
  );
}