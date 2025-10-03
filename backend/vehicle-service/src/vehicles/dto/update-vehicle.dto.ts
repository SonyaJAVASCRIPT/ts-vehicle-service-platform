import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsInt()
  ownerId?: number;
}
