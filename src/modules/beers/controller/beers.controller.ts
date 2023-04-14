import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RequestCreateBeer } from '../contract/requestCreateBeer';
import { ResponseBeer } from '../contract/responseBeer';
import { RequestUpdateBeer } from '../contract/requestUpdateBeer';
import { FindBeerByTemperatureService } from '../service/findBeerByTemperature.service';
import { CreateBeerService } from '../service/createBeer.service';
import { DeleteBeerByStyleService } from '../service/deleteBeerByStyle.service';
import { RequestBeerByTemperature } from '../contract/requestBeerByTemperature';
import { ResponseBeerAndSpotify } from '../contract/responseBeerAndSpotify';
import { ListBeerService } from '../service/listBeer.service';
import { UpdateBeerByIdService } from '../service/updateBeerById.service';

@Controller('beers')
export class BeersController {
  constructor(
    private readonly createService: CreateBeerService,
    private readonly findBeerByTemperatureService: FindBeerByTemperatureService,
    private readonly listBeerService: ListBeerService,
    private readonly deleteBeerByStyleService: DeleteBeerByStyleService,
    private readonly updateBeerByIdService: UpdateBeerByIdService,
  ) {}

  @Post()
  create(@Body() data: RequestCreateBeer): Promise<any> {
    return this.createService.execute(data);
  }

  @Put('/:id/')
  updateById(
    @Param('id') id: string,
    @Body() data: RequestUpdateBeer,
  ): Promise<ResponseBeer> {
    return this.updateBeerByIdService.execute(id, data);
  }

  @Get()
  list(): Promise<ResponseBeer[]> {
    return this.listBeerService.execute();
  }

  @Get('/temperature/')
  findBeer(
    @Body() data: RequestBeerByTemperature,
  ): Promise<ResponseBeerAndSpotify> {
    return this.findBeerByTemperatureService.execute(data);
  }

  @Delete('/:style/')
  deleteByStyle(@Param('style') style: string): Promise<void> {
    return this.deleteBeerByStyleService.execute(style);
  }
}
