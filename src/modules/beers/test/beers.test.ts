import { SpotifyProvider } from 'src/provider/implements/Spotify.Provider';

export default class MockSpotifyProvider extends SpotifyProvider {
  async getPlaylistByName(name: string): Promise<any> {
    return Promise.resolve({
      id: '123456',
    } as any);
  }

  async getTracksByPlaylistId(playlistId: string): Promise<any> {
    const playlistMock: any = {
      items: [
        {
          track: {
            id: '1',
            name: 'Song 1',
          },
        },
        {
          track: {
            id: '2',
            name: 'Song 2',
          },
        },
      ],
    };
    return Promise.resolve(playlistMock);
  }
}
