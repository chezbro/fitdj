// File: models/workoutModel.ts

export interface Exercise {
  name: string;
  duration: number;
  description: string;
  spotifyTrackUri: string;
  intensity: 'low' | 'medium' | 'high';
  voiceCues: string[];
}

export const fullBodyWorkout: Exercise[] = [
  {
    name: "Warm-up Jog",
    duration: 60,
    description: "Start with a light jog in place to warm up your muscles.",
    spotifyTrackUri: "spotify:track:2KH16WveTQWT6KOG9Rg6e2",
    intensity: "low",
    voiceCues: [
      "Let's start with a light jog in place.",
      "Keep your pace steady, we're just warming up.",
      "30 seconds left, maintain your rhythm.",
      "Great job, keep it up for the final stretch!"
    ]
  },
  {
    name: "Jumping Jacks",
    duration: 45,
    description: "Jump while raising your arms and spreading your legs out and in.",
    spotifyTrackUri: "spotify:track:1zi7xx7UVEFkmKfv06H8x0",
    intensity: "medium",
    voiceCues: [
      "Time for jumping jacks! Start jumping!",
      "Keep your arms straight as they go up and down.",
      "Halfway there, maintain your energy!",
      "Final push, give it your all!"
    ]
  },
  {
    name: "Push-ups",
    duration: 30,
    description: "Lower your body to the ground and push back up, keeping your core tight.",
    spotifyTrackUri: "spotify:track:0V3wPSX9ygBnCm8psDIegu",
    intensity: "high",
    voiceCues: [
      "Get into push-up position.",
      "Keep your core tight and back straight.",
      "Halfway point, keep pushing!",
      "Last few reps, you've got this!"
    ]
  },
  {
    name: "Rest",
    duration: 15,
    description: "Take a short break, breathe deeply, and prepare for the next exercise.",
    spotifyTrackUri: "spotify:track:5qfZRNjt2TkHEL12r3sDEU",
    intensity: "low",
    voiceCues: [
      "Time for a quick rest.",
      "Take deep breaths and relax.",
      "Hydrate if you need to.",
      "Get ready for the next exercise."
    ]
  },
  {
    name: "Squats",
    duration: 45,
    description: "Lower your body as if sitting back into a chair, then stand back up.",
    spotifyTrackUri: "spotify:track:6f807x0ima9a1j3VPbc7VN",
    intensity: "high",
    voiceCues: [
      "Let's do some squats! Start in a standing position.",
      "Lower your body, keeping your chest up and weight on your heels.",
      "Push through your heels to stand back up.",
      "Last few reps, feel the burn in your legs!"
    ]
  },
  {
    name: "Plank",
    duration: 30,
    description: "Hold a push-up position, keeping your body straight and core engaged.",
    spotifyTrackUri: "spotify:track:1t4wa5r7E7oZ2D4G07JFsI",
    intensity: "medium",
    voiceCues: [
      "Get into plank position.",
      "Keep your body straight, engage your core.",
      "Halfway there, don't let your hips sag!",
      "Final push, hold strong!"
    ]
  },
  {
    name: "Cool-down Stretch",
    duration: 60,
    description: "Gently stretch your muscles to cool down and prevent soreness.",
    spotifyTrackUri: "spotify:track:3cfOd4CMv2snFaKAnMdnvK",
    intensity: "low",
    voiceCues: [
      "Time to cool down with some stretches.",
      "Stretch your arms overhead, then slowly bend to touch your toes.",
      "Now stretch your quadriceps, holding each leg for 15 seconds.",
      "Finally, do a gentle twist to each side. Great job on your workout!"
    ]
  }
];