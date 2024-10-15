// File: WorkoutSessionScreen.js
// Path: /FITDJ/screens/WorkoutSessionScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function WorkoutSessionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Workout Session Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
}); 