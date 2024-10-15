export interface Exercise {
  name: string;
  duration: number;
  description: string;
  spotifyTrackUri: string;
  intensity: 'low' | 'medium' | 'high';
  voiceCues: string[];
}

export const fullBodyWorkout: Exercise[] = [
  // Add your workout exercises here
  // Example:
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
  // Add more exercises...
];
