import { Test, TestingModule } from '@nestjs/testing';
import { CreateBeerService } from '../service/createBeer.service';
import { Beer } from '../entity/beers.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BeerRepository } from '../repository/beers.repository';
import { CreateBeerDTO } from '../dto/createBeer.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateBeerByIdService } from '../service/updateBeerById.service';
import { ListBeerService } from '../service/listBeer.service';
import { DeleteBeerByStyleService } from '../service/deleteBeerByStyle.service';
import { FindBeerByStyleService } from '../service/findBeerByStyle.service';
import { FindBeerByTemperatureService } from '../service/findBeerByTemperature.service';
import { RequestBeerByTemperature } from '../contract/requestBeerByTemperature';
import { PlaylistBeerDTO } from '../dto/playlistBeer.dto';
import MockSpotifyProvider from './beers.test';

describe('services on beer', () => {
  let createService: CreateBeerService;
  let updateService: UpdateBeerByIdService;
  let listService: ListBeerService;
  let deleteService: DeleteBeerByStyleService;
  let temperatureService: FindBeerByTemperatureService;
  let repository: Repository<Beer>;

  const mockBeer: Beer = {
    id: uuidv4(),
    style: 'IPA',
    temperatureRange: [1, 2],
  };

  const ipa: CreateBeerDTO = {
    style: 'IPA',
    temperatureRange: [1, 2],
  };

  const pilsen: CreateBeerDTO = {
    style: 'Pilsen',
    temperatureRange: [1, 2],
  };

  const playlistMock: PlaylistBeerDTO = {
    name: 'IPA',
    tracks: [{ name: 'Lua de Cristal', artist: 'Xuxa', link: 'Link' }],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBeerService,
        UpdateBeerByIdService,
        ListBeerService,
        DeleteBeerByStyleService,
        FindBeerByStyleService,
        BeerRepository,
        // FindBeerByTemperatureService,
        // SpotifyProvider,
        // {
        //   provide: SpotifyProvider,
        //   useClass: MockSpotifyProvider,
        // },
        {
          provide: getRepositoryToken(Beer),
          useClass: class MockRepository extends Repository<Beer> {
            save = jest.fn().mockResolvedValue(mockBeer);
            findOne = jest.fn().mockResolvedValue(undefined);
            update = jest.fn().mockResolvedValue(mockBeer);
            find = jest.fn().mockResolvedValue([mockBeer]);
            delete = jest.fn().mockResolvedValue(undefined);
          },
        },
      ],
    }).compile();

    createService = module.get<CreateBeerService>(CreateBeerService);
    updateService = module.get<UpdateBeerByIdService>(UpdateBeerByIdService);
    listService = module.get<ListBeerService>(ListBeerService);
    deleteService = module.get<DeleteBeerByStyleService>(
      DeleteBeerByStyleService,
    );
    // temperatureService = module.get<FindBeerByTemperatureService>(
    //   FindBeerByTemperatureService,
    // );

    repository = module.get<Repository<Beer>>(getRepositoryToken(Beer));
    // spotifyProvider = module.get<MockSpotifyProvider>(MockSpotifyProvider);
  });

  test('should be create a new beer with success', async () => {
    const beer = await createService.execute(ipa);
    expect(beer).toEqual(mockBeer);
    expect(repository.save).toHaveBeenCalledWith(ipa);
  });

  test('should be create a new beer with a conflict', async () => {
    const findOneSpy = jest.spyOn(repository, 'findOne');
    findOneSpy.mockResolvedValue(mockBeer);
    try {
      await createService.execute(ipa);
    } catch (error) {
      expect(error.message).toBe(`IPA already exists`);
    }
  });

  test('should be update a beer with conflict', async () => {
    const findOneSpy = jest.spyOn(repository, 'findOne');
    findOneSpy.mockResolvedValue(mockBeer);
    const id = uuidv4();
    try {
      await updateService.execute(id, ipa);
    } catch (error) {
      expect(error.message).toBe(`IPA already exists`);
    }
  });

  test('should be list beers', async () => {
    const beers = await listService.execute();
    expect(Array.isArray(beers)).toBe(true);
    expect(beers[0]).toEqual(mockBeer);
  });

  // test('should be find beer by temperature with succes', async () => {
  //   const beerPilsen = await createService.execute(pilsen);
  //   const beerIpa = await createService.execute(ipa);
  //   const temp: RequestBeerByTemperature = { temperature: 3 };
  //   const data = await temperatureService.execute(temp);
  //   console.log(data);
  // });

  test('should be delete a beer with success', async () => {
    const beer = await createService.execute(ipa);
    const findOneSpy = jest.spyOn(repository, 'findOne');
    findOneSpy.mockResolvedValue(mockBeer);
    const style = beer.style;
    await deleteService.execute(style);
    expect(repository.delete).toHaveBeenCalledWith({ style: style });
  });

  test('should be return erro when a beer not found', async () => {
    const findOneSpy = jest.spyOn(repository, 'findOne');
    findOneSpy.mockResolvedValue(mockBeer);
    const style = ipa.style;
    try {
      await deleteService.execute(style);
    } catch (error) {
      expect(error.message).toBe(`IPA not found`);
    }
  });
});
