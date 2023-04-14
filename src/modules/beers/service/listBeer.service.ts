import { HttpException, Injectable } from '@nestjs/common';
import { BeerRepository } from '../repository/beers.repository';
import { ResponseBeer } from '../contract/responseBeer';

@Injectable()
export class ListBeerService {
  constructor(private readonly beerRepository: BeerRepository) {}
  async execute(): Promise<ResponseBeer[]> {
    try {
      return this.beerRepository.listBeer();
    } catch (error) {
      console.log(`ListBeerService ${error}`);
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }
}
