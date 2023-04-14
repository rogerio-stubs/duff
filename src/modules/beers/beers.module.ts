import { Module } from '@nestjs/common';
import { BeersController } from './controller/beers.controller';
import { FindBeerByTemperatureService } from './service/findBeerByTemperature.service';
import { ListBeerService } from './service/listBeer.service';
import { SpotifyProvider } from 'src/provider/implements/Spotify.Provider';
import { CreateBeerService } from './service/createBeer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Beer } from './entity/beers.entity';
import { BeerRepository } from './repository/beers.repository';
import { DeleteBeerByStyleService } from './service/deleteBeerByStyle.service';
import { FindBeerByStyleService } from './service/findBeerByStyle.service';
import { UpdateBeerByIdService } from './service/updateBeerById.service';

@Module({
  imports: [TypeOrmModule.forFeature([Beer, BeerRepository])],
  controllers: [BeersController],
  providers: [
    ListBeerService,
    CreateBeerService,
    FindBeerByTemperatureService,
    SpotifyProvider,
    BeerRepository,
    DeleteBeerByStyleService,
    FindBeerByStyleService,
    UpdateBeerByIdService,
  ],
})
export class BeersModule {}
