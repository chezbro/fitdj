import SpotifyWebApi from 'spotify-web-api-js';
import Constants from 'expo-constants';
import * as crypto from 'expo-crypto';
import { encode as base64Encode } from 'base-64';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

// Custom stringify function
function stringify(obj: Record<string, string>): string {
  return Object.entries(obj)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

class SpotifyPlayer {
  private spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
  private accessToken: string | null = null;
  private clientId: string;
  private redirectUri: string;

  constructor() {
    this.spotifyApi = new SpotifyWebApi();
    this.clientId = Constants.expoConfig?.extra?.SPOTIFY_CLIENT_ID || '';
    this.redirectUri = makeRedirectUri({
      scheme: Constants.expoConfig?.scheme,
      path: 'spotify-auth-callback',
    });
  }

  async authorize(): Promise<string> {
    if (!this.clientId) {
      throw new Error('Spotify client ID is not set');
    }

    const codeVerifier = await this.generateRandomString(64);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    const state = await this.generateRandomString(16);

    const queryParams = stringify({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      state: state,
      scope: 'streaming user-read-email user-read-private user-library-read user-library-modify',
    });

    const authUrl = `https://accounts.spotify.com/authorize?${queryParams}`;

    try {
      const result = await WebBrowser.openAuthSessionAsync(authUrl, this.redirectUri);

      if (result.type === 'success' && result.url) {
        const { code, state: returnedState } = this.parseQueryString(result.url);

        if (returnedState !== state) {
          throw new Error('Invalid state');
        }

        const tokenResult = await this.exchangeCodeForToken(code, codeVerifier);
        this.setAccessToken(tokenResult.access_token);
        return tokenResult.access_token;
      } else {
        throw new Error('Authorization was canceled or failed');
      }
    } catch (error) {
      console.error('Failed to authorize Spotify:', error);
      throw error;
    }
  }

  private parseQueryString(url: string): Record<string, string> {
    const params = new URLSearchParams(url.split('?')[1]);
    const result: Record<string, string> = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  }

  private async exchangeCodeForToken(code: string, codeVerifier: string): Promise<any> {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const body = stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      code_verifier: codeVerifier,
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    return response.json();
  }

  private async generateRandomString(length: number): Promise<string> {
    const randomBytes = await crypto.getRandomBytesAsync(length);
    return base64Encode(String.fromCharCode(...new Uint8Array(randomBytes)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const digest = await crypto.digestStringAsync(
      crypto.CryptoDigestAlgorithm.SHA256,
      codeVerifier
    );
    return base64Encode(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  async play(uri: string): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Spotify access token not set');
    }

    try {
      await this.spotifyApi.play({ uris: [uri] });
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
      await this.spotifyApi.pause();
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
