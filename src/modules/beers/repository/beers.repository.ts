import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Beer } from '../entity/beers.entity';
import { Repository } from 'typeorm';
import { CreateBeerDTO } from '../dto/createBeer.dto';
import { UpdateBeerDTO } from '../dto/updatebeer.dto';

@Injectable()
export class BeerRepository {
  constructor(
    @InjectRepository(Beer)
    private beerRepository: Repository<Beer>,
  ) {}

  async createBeer(data: CreateBeerDTO): Promise<Beer> {
    return await this.beerRepository.save(data);
  }

  async findBeerByStyle(style: string): Promise<Beer> {
    return await this.beerRepository.findOne({ where: { style } });
  }

  async deleteBeerByStyle(style: string): Promise<void> {
    await this.beerRepository.delete({ style });
  }

  async listBeer(): Promise<Beer[]> {
    return await this.beerRepository.find();
  }

  async updateBeer({ id, ...beer }: UpdateBeerDTO): Promise<Beer> {
    await this.beerRepository.update(id, beer);
    const updatedBeer = await this.beerRepository.findOne({ where: { id } });
    return updatedBeer;
  }
}
