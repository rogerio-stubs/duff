import { HttpException, Injectable } from '@nestjs/common';
import { FindBeerByStyleService } from './findBeerByStyle.service';
import { BeerRepository } from '../repository/beers.repository';

@Injectable()
export class DeleteBeerByStyleService {
  constructor(
    private readonly beerRepository: BeerRepository,
    private readonly findBeerByStyleService: FindBeerByStyleService,
  ) {}

  async execute(style: string): Promise<void> {
    try {
      await this.findBeerByStyleService.execute(style);

      this.beerRepository.deleteBeerByStyle(style);
    } catch (error) {
      console.log(`deleteBeerByStyleService ${error}`);
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }
}
