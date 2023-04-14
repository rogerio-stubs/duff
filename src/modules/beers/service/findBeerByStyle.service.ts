import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { BeerRepository } from '../repository/beers.repository';
import { ResponseBeer } from '../contract/responseBeer';

@Injectable()
export class FindBeerByStyleService {
  constructor(private readonly beerRepository: BeerRepository) {}
  async execute(style: string): Promise<ResponseBeer> {
    try {
      const beer = await this.beerRepository.findBeerByStyle(style);

      if (!beer) throw new NotFoundException(`${style} not found`);

      return beer;
    } catch (error) {
      console.log(`FindBeerByStyleService ${error}`);
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }
}
