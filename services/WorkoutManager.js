// File: WorkoutManager.js
// Path: /FITDJ/services/WorkoutManager.js

import { Workout, Exercise, createSampleWorkout } from '../models/WorkoutModels';
import VoiceAIManager from './VoiceAIManager';
import SpotifyManager from './SpotifyManager';

class WorkoutManager {
  constructor() {
    this.currentWorkout = null;
    this.currentExercise = null;
    this.currentExerciseIndex = 0;
    this.isWorkoutActive = false;
    this.timeRemaining = 0;
    this.timerInterval = null;
  }

  async startWorkout() {
    this.isWorkoutActive = true;
    this.currentWorkout = await createSampleWorkout(); // Replace with actual workout selection logic
    this.currentExerciseIndex = 0;
    await this.moveToNextExercise();
  }

  async endWorkout() {
    this.isWorkoutActive = false;
    this.currentWorkout = null;
    this.currentExercise = null;
    this.currentExerciseIndex = 0;
    this.timeRemaining = 0;
    clearInterval(this.timerInterval);
    await SpotifyManager.pausePlayback();
    await VoiceAIManager.stop();
  }

  async moveToNextExercise() {
    if (!this.currentWorkout) return;

    const exercises = await this.currentWorkout.getExercises();
    if (this.currentExerciseIndex < exercises.length) {
      this.currentExercise = exercises[this.currentExerciseIndex];
      this.timeRemaining = this.currentExercise.duration;
      this.currentExerciseIndex++;

      await VoiceAIManager.speakText(`Next exercise: ${this.currentExercise.name}. ${this.currentExercise.description}`);
      await SpotifyManager.playTrack(this.currentExercise.spotifyTrackURI);

      this.startTimer();
    } else {
      await this.endWorkout();
    }
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        this.moveToNextExercise();
      }
    }, 1000);
  }
}

export default new WorkoutManager();