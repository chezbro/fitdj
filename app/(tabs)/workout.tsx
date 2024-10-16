// File: app/(tabs)/workout.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import voiceAI from '../../services/voiceAI';
import spotifyPlayer from '../../services/spotifyPlayer';
import { Exercise, fullBodyWorkout } from '../../models/workoutModel';
import { authorize as spotifyAuthorize } from 'react-native-app-auth';
import Constants from 'expo-constants';

export default function Workout() {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentVoiceCueIndex, setCurrentVoiceCueIndex] = useState(0);
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        setIsAuthorizing(true);
        const token = await spotifyPlayer.authorize();
        setSpotifyAccessToken(token);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize services:', error);
        Alert.alert('Error', `Failed to authorize Spotify: ${error.message}`);
      } finally {
        setIsAuthorizing(false);
      }
    };

    initializeServices();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
        
        // Trigger voice cues
        const currentExercise = fullBodyWorkout[currentExerciseIndex];
        const cueInterval = Math.floor(currentExercise.duration / currentExercise.voiceCues.length);
        if (timeRemaining % cueInterval === 0 && currentVoiceCueIndex < currentExercise.voiceCues.length) {
          voiceAI.speak(currentExercise.voiceCues[currentVoiceCueIndex]);
          setCurrentVoiceCueIndex((prevIndex) => prevIndex + 1);
        }
      }, 1000);
    } else if (timeRemaining === 0 && currentExerciseIndex < fullBodyWorkout.length - 1) {
      moveToNextExercise();
    } else if (timeRemaining === 0 && currentExerciseIndex === fullBodyWorkout.length - 1) {
      endWorkout();
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, timeRemaining, currentExerciseIndex, currentVoiceCueIndex]);

  const startWorkout = async () => {
    if (!isInitialized || !spotifyAccessToken) {
      Alert.alert('Error', 'Services are not initialized yet. Please wait and try again.');
      return;
    }

    try {
      setIsWorkoutActive(true);
      setCurrentExerciseIndex(0);
      setTimeRemaining(fullBodyWorkout[0].duration);
      setCurrentVoiceCueIndex(0);

      await voiceAI.speak(`Let's start our workout with ${fullBodyWorkout[0].name}. ${fullBodyWorkout[0].description}`);
      await spotifyPlayer.play(fullBodyWorkout[0].spotifyTrackUri);
    } catch (error) {
      console.error('Error starting workout:', error);
      Alert.alert('Error', 'Failed to start workout. Please try again.');
    }
  };

  const endWorkout = async () => {
    setIsWorkoutActive(false);
    setCurrentExerciseIndex(0);
    setTimeRemaining(0);
    setCurrentVoiceCueIndex(0);
    try {
      if (spotifyAccessToken) {
        await spotifyPlayer.pause();
      }
      await voiceAI.speak("Great job! You've completed your workout. Remember to stay hydrated and stretch.");
    } catch (error) {
      console.error('Error ending workout:', error);
      Alert.alert('Error', 'Failed to end workout properly. Please check your connection.');
    }
  };

  const moveToNextExercise = async () => {
    const nextIndex = currentExerciseIndex + 1;
    setCurrentExerciseIndex(nextIndex);
    setTimeRemaining(fullBodyWorkout[nextIndex].duration);
    setCurrentVoiceCueIndex(0);
    try {
      await voiceAI.speak(`Next up is ${fullBodyWorkout[nextIndex].name}. ${fullBodyWorkout[nextIndex].description}`);
      await spotifyPlayer.play(fullBodyWorkout[nextIndex].spotifyTrackUri);
    } catch (error) {
      console.error('Error moving to next exercise:', error);
      Alert.alert('Error', 'Failed to start next exercise. Please check your connection.');
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentExercise: Exercise | undefined = fullBodyWorkout[currentExerciseIndex];

  return (
    <LinearGradient colors={['#8E2DE2', '#4A00E0']} style={styles.container}>
      {isWorkoutActive ? (
        <View style={styles.workoutActive}>
          <Text style={styles.exerciseName}>{currentExercise?.name}</Text>
          <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
          <Text style={styles.intensity}>Intensity: {currentExercise?.intensity}</Text>
          <TouchableOpacity style={styles.button} onPress={endWorkout}>
            <Text style={styles.buttonText}>End Workout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.workoutInactive}>
          <Text style={styles.title}>Ready for your FITDJ workout?</Text>
          <TouchableOpacity 
            style={[styles.button, (!isInitialized || isAuthorizing) && styles.buttonDisabled]} 
            onPress={startWorkout}
            disabled={!isInitialized || isAuthorizing}
          >
            <Text style={styles.buttonText}>
              {isAuthorizing ? 'Authorizing Spotify...' : isInitialized ? 'Start Workout' : 'Initializing...'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutActive: {
    alignItems: 'center',
  },
  workoutInactive: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  timer: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  intensity: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
