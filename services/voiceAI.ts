// File: services/voiceAI.ts
import { Audio } from 'expo-av';
import Constants from 'expo-constants';

class VoiceAI {
  private apiKey: string;
  private voiceId: string;
  private sound: Audio.Sound | null = null;

  constructor() {
    this.apiKey = Constants.expoConfig?.extra?.ELEVENLABS_API_KEY || '';
    this.voiceId = Constants.expoConfig?.extra?.ELEVENLABS_VOICE_ID || '';
  }

  async speak(text: string): Promise<void> {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
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

      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          if (typeof reader.result === 'string') {
            const base64Audio = reader.result.split(',')[1];
            
            if (this.sound) {
              await this.sound.unloadAsync();
            }

            const { sound } = await Audio.Sound.createAsync(
              { uri: `data:audio/mpeg;base64,${base64Audio}` },
              { shouldPlay: true }
            );

            this.sound = sound;
            await this.sound.playAsync();
            resolve();
          } else {
            reject(new Error('Failed to read audio data'));
          }
        };
        reader.onerror = reject;
      });
    } catch (error) {
      console.error('Error in text-to-speech:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }
}

const voiceAI = new VoiceAI();
export default voiceAI;
