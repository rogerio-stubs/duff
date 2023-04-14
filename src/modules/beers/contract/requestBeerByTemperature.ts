import { IsNotEmpty, IsNumber } from 'class-validator';

export class RequestBeerByTemperature {
  @IsNotEmpty({ message: 'The field must not be a empty' })
  @IsNumber()
  temperature: number;
}
