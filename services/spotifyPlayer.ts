import SpotifyWebApi from 'spotify-web-api-js';
import Constants from 'expo-constants';
import { encode as base64Encode } from 'base-64';

class SpotifyPlayer {
  private spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
  private accessToken: string | null = null;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.spotifyApi = new SpotifyWebApi();
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
      // Note: With client credentials, you can't control playback.
      // This method will need to be adjusted based on what's allowed with this token.
      console.log(`Would play track: ${uri}`);
    } catch (error) {
      console.error('Error playing track:', error);
      throw error;
    }
  }

  async pause(): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Spotify access token not set');
    }

    try {
      // Note: With client credentials, you can't control playback.
      // This method will need to be adjusted based on what's allowed with this token.
      console.log('Would pause playback');
    } catch (error) {
      console.error('Failed to pause playback:', error);
      throw error;
    }
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
    this.spotifyApi.setAccessToken(token);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}

const spotifyPlayer = new SpotifyPlayer();
export default spotifyPlayer;
