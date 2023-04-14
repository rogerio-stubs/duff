import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { RequestCreateBeer } from '../contract/requestCreateBeer';
import { CreateBeerDTO } from '../dto/createBeer.dto';
import { BeerRepository } from '../repository/beers.repository';

@Injectable()
export class CreateBeerService {
  constructor(private readonly beerRepository: BeerRepository) {}
  async execute(data: RequestCreateBeer): Promise<any> {
    try {
      const existsBeer = await this.beerRepository.findBeerByStyle(data.style);

      if (existsBeer)
        throw new ConflictException(`${data.style} already exists`);

      const beer: CreateBeerDTO = data;
      const newBeer = this.beerRepository.createBeer(beer);
      return newBeer;
    } catch (error) {
      console.log(`CreateBeerService ${error}`);
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }
}
