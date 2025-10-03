import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateVehicleDto {
  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsNotEmpty()
  @IsInt()
  ownerId: number;
}
