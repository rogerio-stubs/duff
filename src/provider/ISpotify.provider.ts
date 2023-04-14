export interface ISpotifyProvider {
  getPlaylistByName(playlistName: string): Promise<any>;
  getTracksByPlaylistId(playlistId: string): Promise<any>;
}
