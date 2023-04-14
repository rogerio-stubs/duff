import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class RequestCreateBeer {
  @IsArray({ message: 'The field must be a array, with two elements' })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNotEmpty({ message: 'The field must not be a empty' })
  temperatureRange: [number, number];

  @IsString({ message: 'The field must be a string' })
  @IsNotEmpty({ message: 'The field must not be a empty' })
  style: string;
}
