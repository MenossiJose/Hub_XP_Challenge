import {
  IsArray,
  IsNumber,
  IsNotEmpty,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date?: Date;

  @IsArray()
  @IsNotEmpty()
  productIds: string[];

  @IsNumber()
  @IsNotEmpty()
  total: number;
}
