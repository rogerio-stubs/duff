class Tracks {
  name: string;
  artist: string;
  link: string;
}

class PlayList {
  name: string;
  tracks: Tracks[];
}

export class ResponseBeerAndSpotify {
  beerStyle: string;
  playlist?: PlayList;
}
