import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { RequestUpdateBeer } from '../contract/requestUpdateBeer';
import { UpdateBeerDTO } from '../dto/updatebeer.dto';
import { FindBeerByStyleService } from './findBeerByStyle.service';
import { BeerRepository } from '../repository/beers.repository';
import { ResponseBeer } from '../contract/responseBeer';

@Injectable()
export class UpdateBeerByIdService {
  constructor(private readonly beerRepository: BeerRepository) {}

  async execute(id: string, data: RequestUpdateBeer): Promise<ResponseBeer> {
    try {
      const existsBeer = await this.beerRepository.findBeerByStyle(data.style);

      if (existsBeer)
        throw new ConflictException(`${data.style} already exists`);

      const beer: UpdateBeerDTO = { id, ...data };
      const updateBeer = await this.beerRepository.updateBeer(beer);
      return updateBeer;
    } catch (error) {
      console.log(`updateBeerByIdService ${error}`);
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }
}
