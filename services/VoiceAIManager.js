// File: VoiceAIManager.js
// Path: /FITDJ/services/VoiceAIManager.js

import { Audio } from 'expo-av';

class VoiceAIManager {
  constructor() {
    this.apiKey = 'YOUR_ELEVENLABS_API_KEY';
    this.voiceID = 'YOUR_CHOSEN_VOICE_ID';
    this.sound = null;
  }

  async speakText(text) {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = new Uint8Array(arrayBuffer);

      if (this.sound) {
        await this.sound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: `data:audio/mpeg;base64,${Buffer.from(audioBuffer).toString('base64')}` },
        { shouldPlay: true }
      );

      this.sound = sound;
      await this.sound.playAsync();
    } catch (error) {
      console.error('Error speaking text:', error);
    }
  }

  async stop() {
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }
}

export default new VoiceAIManager();