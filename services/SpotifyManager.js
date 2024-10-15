// File: SpotifyManager.js
// Path: /FITDJ/services/SpotifyManager.js

import { authorize, refresh, getAuthorizationCode } from 'react-native-app-auth';
import SpotifyWebApi from 'spotify-web-api-js';

class SpotifyManager {
  constructor() {
    this.spotifyApi = new SpotifyWebApi();
    this.config = {
      clientId: 'YOUR_SPOTIFY_CLIENT_ID',
      clientSecret: 'YOUR_SPOTIFY_CLIENT_SECRET',
      redirectUrl: 'YOUR_SPOTIFY_REDIRECT_URI',
      scopes: ['streaming', 'user-read-email', 'user-read-private', 'user-library-read', 'user-library-modify'],
    };
  }

  async authorize() {
    try {
      const result = await authorize(this.config);
      this.spotifyApi.setAccessToken(result.accessToken);
      return result;
    } catch (error) {
      console.error('Failed to authorize Spotify:', error);
    }
  }

  async refreshToken(refreshToken) {
    try {
      const result = await refresh(this.config, {
        refreshToken: refreshToken,
      });
      this.spotifyApi.setAccessToken(result.accessToken);
      return result;
    } catch (error) {
      console.error('Failed to refresh Spotify token:', error);
    }
  }

  async playTrack(uri) {
    try {
      await this.spotifyApi.play({ uris: [uri] });
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  }

  async pausePlayback() {
    try {
      await this.spotifyApi.pause();
    } catch (error) {
      console.error('Failed to pause playback:', error);
    }
  }

  async resumePlayback() {
    try {
      await this.spotifyApi.play();
    } catch (error) {
      console.error('Failed to resume playback:', error);
    }
  }
}

export default new SpotifyManager();