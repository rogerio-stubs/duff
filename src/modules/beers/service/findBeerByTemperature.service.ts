import { HttpException, Injectable } from '@nestjs/common';
import { SpotifyProvider } from 'src/provider/implements/Spotify.Provider';
import { BeerRepository } from '../repository/beers.repository';
import { RequestBeerByTemperature } from '../contract/requestBeerByTemperature';
import { ResponseBeerAndSpotify } from '../contract/responseBeerAndSpotify';
import { PlaylistBeerDTO } from '../dto/playlistBeer.dto';

@Injectable()
export class FindBeerByTemperatureService {
  constructor(
    private readonly spotifyProvider: SpotifyProvider,
    private readonly beerRepository: BeerRepository,
  ) {}

  private async averageTemperature(temperature: number): Promise<string> {
    const averageBeers = [];
    const stylesBeer = [];
    const beers = await this.beerRepository.listBeer();

    beers.map((beer) => {
      const sum = beer.temperatureRange.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
      );
      const average = sum / beer.temperatureRange.length;
      const diff = Math.abs(average - temperature);
      averageBeers.push(diff);
    });

    const minValue = Math.min(...averageBeers);

    averageBeers.forEach((element, index) => {
      if (element === minValue) stylesBeer.push(beers[index].style);
    });
    const beerStyle = stylesBeer.sort();

    return beerStyle[0];
  }

  private async normalizeDataSpotify(
    beerStyle: string,
  ): Promise<PlaylistBeerDTO> {
    const tracks = [];
    const playlist = await this.spotifyProvider.getPlaylistByName(beerStyle);

    const tracksOfPlaylistId = await this.spotifyProvider.getTracksByPlaylistId(
      playlist.playlists.items[0].id,
    );

    tracksOfPlaylistId.items.map((item) => {
      const track = {
        name: item.track.name,
        artist: item.track.artists[0].name,
        link: item.track.external_urls.spotify,
      };
      tracks.push(track);
    });
    const data = {
      name: playlist.playlists.items[0].name,
      tracks,
    };
    return data;
  }

  async execute({
    temperature,
  }: RequestBeerByTemperature): Promise<ResponseBeerAndSpotify> {
    try {
      const beerStyle = await this.averageTemperature(temperature);
      const playlist = await this.normalizeDataSpotify(beerStyle);
      const createResponse: ResponseBeerAndSpotify = {
        beerStyle,
        playlist,
      };
      return createResponse;
    } catch (error) {
      console.log(`FindBeerByTemperatureService ${error}`);
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }
}
