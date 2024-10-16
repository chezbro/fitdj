import { Audio } from 'expo-av';
import Constants from 'expo-constants';
import { encode as base64Encode } from 'base-64';

class SpotifyPlayer {
  private sound: Audio.Sound | null = null;
  private accessToken: string | null = null;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = Constants.expoConfig?.extra?.SPOTIFY_CLIENT_ID || '';
    this.clientSecret = Constants.expoConfig?.extra?.SPOTIFY_CLIENT_SECRET || '';
  }

  async authorize(): Promise<string> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Spotify client ID or client secret is not set');
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + base64Encode(this.clientId + ':' + this.clientSecret),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        throw new Error('Failed to obtain access token');
      }

      const data = await response.json();
      this.setAccessToken(data.access_token);
      return data.access_token;
    } catch (error) {
      console.error('Failed to authorize Spotify:', error);
      throw error;
    }
  }

  async play(uri: string): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Spotify access token not set');
    }

    try {
      // Get the track information from Spotify API
      const trackId = uri.split(':').pop();
      const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch track information');
      }

      const trackData = await response.json();
      const previewUrl = trackData.preview_url;

      if (!previewUrl) {
        throw new Error('No preview URL available for this track');
      }

      // Unload any previously loaded audio
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      // Load and play the audio
      const { sound } = await Audio.Sound.createAsync({ uri: previewUrl }, { shouldPlay: true });
      this.sound = sound;
    } catch (error) {
      console.error('Error playing track:', error);
      throw error;
    }
  }

  async pause(): Promise<void> {
    if (this.sound) {
      await this.sound.pauseAsync();
    }
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}

const spotifyPlayer = new SpotifyPlayer();
export default spotifyPlayer;
