import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateFineDto {
  @IsString()
  date: string;
  @IsString()
  description: string;
  @IsNumber()
  amount: number;
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UpdateFineDto {
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
