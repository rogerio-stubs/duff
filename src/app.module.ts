import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BeersModule } from './modules/beers/beers.module';
import { SpotifyProvider } from './provider/implements/Spotify.Provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Beer } from './modules/beers/entity/beers.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Beer],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Beer]),
    BeersModule,
  ],
  controllers: [AppController],
  providers: [AppService, SpotifyProvider],
})
export class AppModule {}
