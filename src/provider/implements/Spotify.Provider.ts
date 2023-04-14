import { ISpotifyProvider } from '../ISpotify.provider';
import axios from 'axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AuthDTO } from '../dto/auth.dto';

@Injectable()
export class SpotifyProvider implements ISpotifyProvider {
  private readonly url = 'https://api.spotify.com/v1/';

  private paramsAuth: AuthDTO;

  private async auth(): Promise<void> {
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SERCRET,
    });
    try {
      const responseData = await axios.post(
        'https://accounts.spotify.com/api/token',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      this.paramsAuth = responseData.data;
    } catch (error) {
      console.log('auth', error);
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }
  async getPlaylistByName(playlistName: string): Promise<any> {
    try {
      await this.auth();
      const responseData = await axios.get(
        `${this.url}search?q=${playlistName}&type=playlist`,
        {
          headers: {
            Authorization: `Bearer ${this.paramsAuth.access_token}`,
          },
        },
      );
      return responseData.data;
    } catch (error) {
      console.log('getPlaylistByName', error);
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

  async getTracksByPlaylistId(playlistId: string): Promise<any> {
    try {
      await this.auth();
      const responseData = await axios.get(
        `${this.url}playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${this.paramsAuth.access_token}`,
          },
        },
      );
      return responseData.data;
    } catch (error) {
      console.log('getTracksByPlaylistId', error);
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }
}
